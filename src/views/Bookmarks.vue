<template>
  <div class="home">
<!--    <amplify-connect-->
<!--      v-if="owner"-->
<!--      :query="listBookmarksQuery"-->
<!--      :subscription="createBookmarkSubscription"-->
<!--      :onSubscriptionMsg="onCreateBookmarkCallback"-->
<!--    >-->
<!--      <template slot-scope="{loading, data: { listBookmarks: { items } = {} }, errors}">-->
<!--        <div v-if="loading">Loading...</div>-->

<!--        <div v-else-if="errors.length > 0"></div>-->
        <bookmark
          v-for="bookmark in listBookmarks ? listBookmarks.items : []"
          :key="bookmark.id"
          :bookmark="bookmark"
          @delete="deleteBookmark"
        />
        <create-bookmark />
<!--      </template>-->
<!--    </amplify-connect>-->

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import gql from 'graphql-tag';
// @ts-ignore
import { components } from 'aws-amplify-vue';
import { Auth } from 'aws-amplify';
import CreateBookmark from '@/components/CreateBookmark.vue';
import { listBookmarks } from '../graphql/queries';
import { onCreateBookmark } from '@/graphql/subscriptions';
import Bookmark from '@/components/Bookmark.vue';
import { deleteBookmark } from '@/graphql/mutations';

@Component({
  components: {
    ...components,
    CreateBookmark,
    Bookmark,
  },
  apollo: {
    listBookmarks: {
      query: gql(listBookmarks),
    },
  },
})
export default class Bookmarks extends Vue {
    @Prop() private msg!: string;

    owner = null;

    created() {
      Auth.currentAuthenticatedUser()
        .then((data: any) => {
          this.owner = data.username;
          this.$apollo.queries.listBookmarks.subscribeToMore({
            document: gql(onCreateBookmark),
            variables: {
              owner: this.owner,
            },
            updateQuery: (previousResult, { subscriptionData }) => {
              // Here, return the new result from the previous with the new data
              previousResult.listBookmarks
                .items
                .push(subscriptionData.data.onCreateBookmark);
              return previousResult;
            },
          });
        });
    }

    deleteBookmark(bookmark: any) {
      this.$apollo.mutate({
        mutation: gql(deleteBookmark),
        variables: {
          input: {
            id: bookmark.id,
          },
        },
        update: (store, { data: { deleteBookmark: deleted } }) => {
          // Read the data from our cache for this query.
          const data: any = store.readQuery({ query: gql(listBookmarks) });
          const idx = data.listBookmarks.items.findIndex((i: any) => i.id === deleted.id);
          data.listBookmarks.items.splice(
            idx,
            1,
          );
          // Write our data back to the cache.
          store.writeQuery({ query: gql(listBookmarks), data });
        },
        // Optimistic UI
        // Will be treated as a 'fake' result as soon as the request is made
        // so that the UI can react quickly and the user be happy
        optimisticResponse: {
          __typename: 'Mutation',
          deleteBookmark: bookmark,
        },
      }).then(() => {});
    }
}
</script>

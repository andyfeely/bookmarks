<template>
  <div class="home">
    <mat-modal v-model="showCreate">
      <mat-card
        color="primary-5"
        round="3"
      >
        <mat-container padding="15px">
          <create-bookmark />
        </mat-container>
      </mat-card>
    </mat-modal>
    <mat-container padding="15px">
      <mat-button @click="showCreate = true">
        New
      </mat-button>
      <br>
      <br>
      <mat-list>
        <mat-list-item
          v-for="bookmark in listBookmarks ? listBookmarks.items : []"
          :key="bookmark.id"
        >
          <bookmark
            :bookmark="bookmark"
            @delete="deleteBookmark"
          />
        </mat-list-item>
      </mat-list>
    </mat-container>
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
import { onCreateBookmark, onDeleteBookmark } from '@/graphql/subscriptions';
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
      variables: {
        limit: 500,
      },
    },
  },
})
export default class Bookmarks extends Vue {
  @Prop() private msg!: string;

  owner = null;

  showCreate = false;

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
            this.showCreate = false;
            previousResult.listBookmarks
              .items
              .push(subscriptionData.data.onCreateBookmark);
            return previousResult;
          },
        });
        this.$apollo.queries.listBookmarks.subscribeToMore({
          document: gql(onDeleteBookmark),
          variables: {
            owner: this.owner,
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            const deleted = subscriptionData.data.onDeleteBookmark;
            const idx = previousResult
              .listBookmarks
              .items.findIndex((i: any) => i.id === deleted.id);
            if (idx > -1) {
              previousResult
                .listBookmarks
                .items.splice(
                  idx,
                  1,
                );
            }
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
        const data: any = store.readQuery({
          query: gql(listBookmarks),
          variables: {
            limit: 500,
          },
        });
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

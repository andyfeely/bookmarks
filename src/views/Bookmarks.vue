<template>
  <div class="home">
    <amplify-connect
      v-if="owner"
      :query="listBookmarksQuery"
      :subscription="createBookmarkSubscription"
      :onSubscriptionMsg="onCreateBookmarkCallback"
    >
      <template slot-scope="{loading, data: { listBookmarks: { items } = {} }, errors}">
        <div v-if="loading">Loading...</div>

        <div v-else-if="errors.length > 0"></div>
        <bookmark
          v-for="bookmark in items"
          :key="bookmark.id"
          :bookmark="bookmark"
          @deleted="onDeleteBookmark"
        />
        <create-bookmark />
      </template>
    </amplify-connect>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// @ts-ignore
import { components } from 'aws-amplify-vue';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import CreateBookmark from '@/components/CreateBookmark.vue';
import { listBookmarks } from '../graphql/queries';
import { onCreateBookmark } from '@/graphql/subscriptions';
import api from '../API';
import Bookmark from '@/components/Bookmark.vue';

@Component({
  components: {
    ...components,
    CreateBookmark,
    Bookmark,
  },
})
export default class Bookmarks extends Vue {
    @Prop() private msg!: string;

    owner = null;

    onCreateBookmarkCallback = (prevData, newData) => {
      console.log('New todo from subscription...');
      const newTodo = newData.onCreateBookmark;
      prevData.data.listBookmarks.items.push(newTodo);
      return prevData.data;
    };

    onDeleteBookmark(bookmark) {
      console.log(bookmark, this);
    }

    async beforeCreate() {
      const { username } = await Auth.currentAuthenticatedUser();
      this.owner = username;
    }

    get listBookmarksQuery() {
      const input: api.ListBookmarksQueryVariables = {
        limit: 100,
      };
      return this.$Amplify.graphqlOperation(listBookmarks, {
        ...input,
      });
    }

    get createBookmarkSubscription() {
      return this.$Amplify.graphqlOperation(
        onCreateBookmark,
        { owner: this.owner },
      );
    }
}
</script>

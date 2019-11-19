<template>
  <div class="home">
    <mat-modal v-model="showCreate">
      <mat-card
        color="support-3"
        round="3"
      >
        <mat-container
          padding="15px"
          width="600px"
        >
          <create-bookmark
            :bookmark="editingBookmark"
            @update="updateBookmark"
          />
        </mat-container>
      </mat-card>
    </mat-modal>
    <mat-container padding="15px">
      <div class="actions">
        <mat-input
          v-model="searchString"
          placeholder="Search"
        />
        <mat-button
          @click="showCreate = true"
          color="light-blue-2"
        >
          New
        </mat-button>
      </div>
      <br>
      <mat-list>
        <template v-for="(bookmark, idx) in bookmarks">
          <div
            v-if="idx === 0 || bookmarks[idx - 1].hostname !== bookmark.hostname"
            :key="bookmark.id"
            class="hostname"
          >
            <img :src="`https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmark.hostname}`">
            <div>
              {{ bookmark.hostname }}
            </div>
            <div class="line-break"></div>
          </div>
          <mat-list-item :key="bookmark.id">
            <bookmark
              :bookmark="bookmark"
              @delete="deleteBookmark"
              @edit="() => onEditBookmark(bookmark)"
            />
          </mat-list-item>
        </template>
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
import { deleteBookmark, updateBookmark } from '@/graphql/mutations';

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

  editingBookmark = null;

  searchString = '';

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

  get bookmarksWithDomain() {
    // @ts-ignore
    const bookmarks = this.listBookmarks ? this.listBookmarks.items : [];
    return bookmarks.map((bookmark: any) => {
      try {
        const url = new URL(bookmark.url);
        return {
          ...bookmark,
          hostname: url.hostname,
        };
      } catch (e) {
        return bookmark;
      }
    })
      .sort((a: any, b: any) => {
        if (a.hostname < b.hostname) {
          return -1;
        }
        if (a.last_nom > b.last_nom) {
          return 1;
        }
        return 0;
      });
  }

  get bookmarks() {
    if (this.searchString) {
      const searchString = this.searchString.toLowerCase();
      // eslint-disable-next-line
      return this.bookmarksWithDomain.filter((bookmark: any) => bookmark.name.toLowerCase().includes(searchString)
        || bookmark.url.toLowerCase().includes(searchString));
    }
    return this.bookmarksWithDomain;
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

  onEditBookmark(bookmark: any) {
    this.showCreate = true;
    this.editingBookmark = bookmark;
  }

  updateBookmark(bookmark: any) {
    this.$apollo.mutate({
      mutation: gql(updateBookmark),
      variables: {
        input: {
          id: bookmark.id,
          name: bookmark.name,
          url: bookmark.url,
        },
      },
      // update: (store, { data: { deleteBookmark: deleted } }) => {
      //   // Read the data from our cache for this query.
      //   const data: any = store.readQuery({
      //     query: gql(listBookmarks),
      //     variables: {
      //       limit: 500,
      //     },
      //   });
      //   const idx = data.listBookmarks.items.findIndex((i: any) => i.id === deleted.id);
      //   data.listBookmarks.items.splice(
      //     idx,
      //     1,
      //   );
      //   // Write our data back to the cache.
      //   store.writeQuery({ query: gql(listBookmarks), data });
      // },
      // Optimistic UI
      // Will be treated as a 'fake' result as soon as the request is made
      // so that the UI can react quickly and the user be happy
      // optimisticResponse: {
      //   __typename: 'Mutation',
      //   deleteBookmark: bookmark,
      // },
    }).then(() => {
      this.editingBookmark = null;
      this.showCreate = false;
    });
  }
}
</script>

<style lang="scss" scoped>
  .home {
    .hostname {
      color: #ffffffaa;
      font-size: 0.8em;
      margin: 15px;
      display: flex;
      align-items: center;
      img {
        max-height: 12px;
        margin-right: 10px;
      }
      .line-break {
        flex: 1;
        height: 1px;
        background: #ffffff22;
        margin: 0 15px;
      }
    }
    .actions {
      display: flex;
      :first-child {
        flex: 1;
        margin-right: 15px;
      }
    }
  }
</style>

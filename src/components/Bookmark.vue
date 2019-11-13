<template>
  <div
    class="bookmark"
    @click.self="onClickBookmark"
  >
    <img
      :src="getFavicon"
      alt="Logo"
      :style="{ flex: 0 }"
    >
    <div class="bookmark-name">
      {{ bookmark.name }}
    </div>
    <mat-menu v-model="menu">
      <template slot="trigger">
        <mat-button color="undefined">
          <i class="fas fa-ellipsis-v"></i>
        </mat-button>
      </template>
      <mat-list>
        <mat-list-item  @click="$emit('delete', bookmark)">
          Delete
        </mat-list-item>
      </mat-list>
      <amplify-connect
        :mutation="deleteBookmarkMutation"
        @done="onDeleteFinished">
      </amplify-connect>
    </mat-menu>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import { components } from 'aws-amplify-vue';
import { deleteBookmark } from '@/graphql/mutations';

@Component({
  components: {
    ...components,
  },
  props: {
    bookmark: Object,
  },
})
export default class Bookmark extends Vue {
  menu = false;

  get deleteBookmarkMutation() {
    const { id } = this.bookmark;
    return this.$Amplify.graphqlOperation(
      deleteBookmark,
      { input: { id } },
    );
  }

  get getFavicon() {
    let url;
    try {
      url = new URL(this.bookmark.url);
    } catch (e) {
      return `https://s2.googleusercontent.com/s2/favicons?domain_url=${this.bookmark.url}`;
    }
    const { protocol } = url;
    const domain = url.hostname;
    return `${protocol}//${domain}/favicon.ico`;
  }

  onDeleteFinished() {
    this.$emit('deleted', this.bookmark);
  }

  onClickBookmark() {
    window.open(this.bookmark.url, '_blank');
  }
}
</script>

<style lang="scss" scoped>
  .bookmark {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    img {
      width: 16px;
      height: 16px;
    }
    &-name {
      flex: 1;
      font-size: 14px;
      margin-left: 15px;
    }
  }
</style>

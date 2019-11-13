<template>
  <div
    class="bookmark"
    @click.self="onClickBookmark"
  >
    {{ bookmark.name }}
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

  onDeleteFinished() {
    this.$emit('deleted', this.bookmark);
  }

  onClickBookmark() {
    console.log(this.bookmark);
    window.open(this.bookmark.url, '_blank');
  }
}
</script>

<style scoped>
  .bookmark {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
</style>

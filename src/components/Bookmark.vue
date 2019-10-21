<template>
  <div class="bookmark">
    <amplify-connect
      :mutation="deleteBookmarkMutation"
      @done="onDeleteFinished">
<!--      <template slot-scope="{ loading, mutate }">-->
        {{ bookmark }}
        <mat-button @click="$emit('delete', bookmark)">DELETE</mat-button>
<!--      </template>-->
    </amplify-connect>
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
}
</script>

<style scoped>

</style>

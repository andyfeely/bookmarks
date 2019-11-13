<template>
  <div class="create-bookmark">
    <amplify-connect :mutation="createBookmarkMutation"
                     @done="onCreateFinished">
      <template slot-scope="{ loading, mutate }">
        <mat-input v-model="name" placeholder="Name" />
        <br>
        <mat-input v-model="url" placeholder="URL" />
        <br>
        <mat-button :disabled="loading" @click="mutate">Create Todo</mat-button>
      </template>
    </amplify-connect>
  </div>
</template>

<script>
import { components } from 'aws-amplify-vue';
import { createBookmark } from '@/graphql/mutations';

export default {
  name: 'CreateBookmark',
  components: {
    ...components,
  },
  data() {
    return {
      name: '',
      url: '',
    };
  },
  computed: {
    createBookmarkMutation() {
      const { name, url } = this;
      return this.$Amplify.graphqlOperation(
        createBookmark,
        { input: { name, url } },
      );
    },
  },
  methods: {
    onCreateFinished() {},
  },
};
</script>

<style scoped>

</style>

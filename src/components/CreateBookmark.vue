<template>
  <div class="create-bookmark">
    <amplify-connect :mutation="createBookmarkMutation"
                     @done="onCreateFinished">
      <template slot-scope="{ loading, mutate, errors }">
        {{ errors }}
        <mat-input v-model="name" placeholder="item name" />
        <mat-input v-model="url" placeholder="item name" />
        <button :disabled="loading" @click="mutate">Create Todo</button>
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
    onCreateFinished() {
      console.log('Todo created!');
    },
  },
};
</script>

<style scoped>

</style>

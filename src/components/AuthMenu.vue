<template>
  <mat-menu v-model="menu">
    <mat-container display="flex" slot="trigger">
      <mat-avatar
        size="small"
        :src="user.picture">
        {{ user.given_name }} {{ user.family_name }}
      </mat-avatar>
    </mat-container>
    <mat-list>
      <mat-list-item @click="signOut">
        Sign out
      </mat-list-item>
    </mat-list>
  </mat-menu>
</template>
<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'auth-menu',
  data: () => ({
    menu: false,
    user: {},
  }),
  created() {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        this.user = data.attributes;
      });
  },
  methods: {
    signOut() {
      Auth.signOut();
      this.menu = false;
    },
  },
};
</script>
<style lang="scss">
  body, html {
    padding: 0;
    margin: 0;
    height: 100%;
  }
</style>

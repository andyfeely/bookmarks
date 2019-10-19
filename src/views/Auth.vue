<template>
  <div class="profile">
    <mat-button v-if="!loggedIn" @click="googleSignIn">
      Sign in
    </mat-button>
    <mat-button v-else @click="signOut">ELSE</mat-button>
    <img :src="picture" alt="">
<!--    <mat-button-->
<!--      v-if="username"-->
<!--      @click="() => menu = true">-->
<!--      <mat-flex-layout>-->
<!--        <mat-avatar :src="picture" size="xs" />-->
<!--        <mat-spacer />-->
<!--        {{ username }}-->
<!--      </mat-flex-layout>-->
<!--    </mat-button>-->
<!--    <mat-menu-->
<!--      position="bottom-right"-->
<!--      @close="() => menu = !menu"-->
<!--      v-model="menu">-->
<!--      <mat-list>-->
<!--        <mat-list-item @click="signOut">-->
<!--          <mat-fa space="right" icon="sign-out-alt"></mat-fa>-->
<!--          Sign out-->
<!--        </mat-list-item>-->
<!--      </mat-list>-->
<!--    </mat-menu>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Auth, Hub } from 'aws-amplify';
// @ts-ignore
import { components } from 'aws-amplify-vue';

@Component({
  components: {
    ...components,
  },
})
export default class AuthComponent extends Vue {
    loggedIn = false;

    username: string = '';

    picture: string = '';

    showLogin: boolean = false;

    menu: boolean = false;

    async created() {
      this.getUser();
      Hub.listen('auth', ({ payload: { event, data } }) => {
        switch (event) {
          case 'signIn':
            this.getUser();
            break;
          case 'signOut':
            this.username = '';
            break;
          default:
        }
      });
    }

    signOut() {
      console.log('signing out');
      Auth.signOut();
      this.menu = false;
    }
    // eslint-disable-next-line
    async googleSignIn() {
      // @ts-ignore
      console.log('hello');
      Auth.federatedSignIn({ provider: 'Google' });
    }

    getUser() {
      Auth.currentUserInfo()
        .then((data) => {
          if (data) {
            console.log(data);
            this.loggedIn = true;
            this.username = data.attributes.name;
            this.picture = data.attributes.picture;
          }
        })
        .catch(err => console.log(err));
    }
}

</script>

<style scoped lang="scss">
</style>

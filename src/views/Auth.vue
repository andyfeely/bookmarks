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
      Hub.listen('auth', ({ payload: { event, data } }) => {
        switch (event) {
          case 'signIn':
            this.$router.push('/');
            break;
          case 'signOut':
            this.username = '';
            break;
          default:
        }
      });
    }

    signOut() {
      Auth.signOut();
      this.menu = false;
    }
    // eslint-disable-next-line
    async googleSignIn() {
      // @ts-ignore
      // eslint-disable-next-line
      Auth.federatedSignIn({ provider: 'Google' });
    }
}

</script>

<style scoped lang="scss">
</style>

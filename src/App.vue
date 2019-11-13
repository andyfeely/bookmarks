<template>
  <div id="app">
    <mat-toolbar
      :no-padding="true"
      z-index="5"
      color="blue-grey-2"
    >
      <mat-nav-link @click="() => sidebar = !sidebar">
        Bookmarks
      </mat-nav-link>
    </mat-toolbar>
    <mat-container
      height="100%"
      width="100%"
      display="flex">
      <mat-expansion v-model="sidebar">
        <mat-container
          color="support-4"
          width="300px"
          height="100%"
        >
          <router-link to="/">Bookmarks</router-link> |
          <router-link to="/about">About</router-link>
        </mat-container>
      </mat-expansion>
      <mat-container
        height="100%"
        width="100%"
        color="blue-grey-5"
      >
        <mat-container max-width="720px">
          <router-view/>
        </mat-container>
      </mat-container>
    </mat-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
})
export default class App extends Vue {
  sidebar = false;
}
</script>

<style lang="scss">
  body, html {
    padding: 0;
    margin: 0;
    height: 100%;
  }
#app {
  height: 100%;
  display: grid;
  grid-template-rows: 60px 1fr;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

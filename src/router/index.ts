import Vue from 'vue';
import VueRouter from 'vue-router';
import Bookmarks from '../views/Bookmarks.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'bookmarks',
    component: Bookmarks,
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
  },
  {
    path: '/about',
    name: 'about',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user;
    Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data: any) => {
      if (data && data.signInUserSession) {
        user = data;
      }
      next();
    }).catch((e: any) => {
      next({
        path: '/auth',
      });
    });
  }
  next();
});

export default router;

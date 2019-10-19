import Vue from 'vue';
// @ts-ignore
import VueMateria from '@materiajs/vue-materia';
import Amplify, * as AmplifyModules from 'aws-amplify';
// @ts-ignore
import { AmplifyPlugin } from 'aws-amplify-vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

// @ts-ignore
import config from './aws-exports';

Vue.config.productionTip = false;

AmplifyModules.PubSub.configure(config);

Amplify.configure(config);
Vue.use(AmplifyPlugin, AmplifyModules);
Vue.use(VueMateria);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

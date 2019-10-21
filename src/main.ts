import Vue from 'vue';
// @ts-ignore
import VueMateria from '@materiajs/vue-materia';
import Amplify, * as AmplifyModules from 'aws-amplify';
// @ts-ignore
import { AmplifyPlugin } from 'aws-amplify-vue';
import AWSAppSyncClient from 'aws-appsync';
import VueApollo from 'vue-apollo';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
// @ts-ignore
const config = require('./aws-exports').default;

Vue.config.productionTip = false;

Amplify.configure(config);
Vue.use(AmplifyPlugin, AmplifyModules);
Vue.use(VueMateria);
const apolloConfig = {
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: config.aws_appsync_authenticationType,
    // the below function is run on each request, so it is always kept up to date
    jwtToken: async () => (await AmplifyModules.Auth.currentSession()).getIdToken().getJwtToken(),
  },
  disableOffline: true, // this was added to stop an issue with duplicated list items
};

const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
};

// @ts-ignore
const client = new AWSAppSyncClient(apolloConfig, options);

const appsyncProvider = new VueApollo({
  defaultClient: client,
});

Vue.use(VueApollo);

new Vue({
  router,
  store,
  apolloProvider: appsyncProvider,
  render: h => h(App),
}).$mount('#app');

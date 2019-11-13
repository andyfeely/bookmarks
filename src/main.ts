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

// AMPLIFY UPDATE FOR PROD DEPLOYS
const urlsIn = config.oauth.redirectSignIn.split(',');
const urlsOut = config.oauth.redirectSignOut.split(',');
const oauth = {
  domain: config.oauth.domain,
  scope: config.oauth.scope,
  redirectSignIn: config.oauth.redirectSignIn,
  redirectSignOut: config.oauth.redirectSignOut,
  responseType: config.oauth.responseType,
};
const hasLocalhost = (hostname: string) => Boolean(hostname.match(/localhost/) || hostname.match(/127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/));
const hasHostname = (hostname: string) => Boolean(hostname.includes(window.location.hostname));
const isLocalhost = hasLocalhost(window.location.hostname);
if (isLocalhost) {
  urlsIn.forEach((e: string) => { if (hasLocalhost(e)) { oauth.redirectSignIn = e; } });
  urlsOut.forEach((e: string) => { if (hasLocalhost(e)) { oauth.redirectSignOut = e; } });
} else {
  urlsIn.forEach((e: string) => { if (hasHostname(e)) { oauth.redirectSignIn = e; } });
  urlsOut.forEach((e: string) => { if (hasHostname(e)) { oauth.redirectSignOut = e; } });
}
const configUpdate = config;
configUpdate.oauth = oauth;
// AMPLIFY CONFIG DONE
Amplify.configure(configUpdate);


Vue.use(AmplifyPlugin, AmplifyModules);
Vue.use(VueMateria, {
  theme: 'palette2',
});
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

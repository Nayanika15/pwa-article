import Vue from "vue";
import "babel-polyfill";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import App from "./App";
import { routes } from "./router";
import "../public/assets/js/validatorFile";
import VueSocialauth from "vue-social-auth";
import DataTable from "laravel-vue-datatable";
import store from "./store";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "./registerServiceWorker.js";

Vue.use(Vuetify);
Vue.use(DataTable);

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.root = "http://article.com/api/";
Vue.config.productionTip = false;

//to subscribe user to push notification
  navigator.serviceWorker.ready
    .then(registration => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BPHafgTDdH18kXExQSi_n-L_mIsQqw1DbqsQ5ahb6mYcTX7aQ6keXeZ485fnW384iJaER5aQ8aden-qUMUfBwzA"
        )
      };
      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(pushSubscription => {
      console.log(
        "Received PushSubscription: ",
        JSON.stringify(pushSubscription)
      );
      storePushSubscription(pushSubscription);
    });

//to convert public key to required format
function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

//store subscription in server
function storePushSubscription(pushSubscription) {
  Vue.http.post("push", pushSubscription,{
    headers: {
      'X-CSRF-Token' : 'eJTR14XeW6RcRtpWx6mDwORPHglXYVyipPN68IlE'
    }
  }
  )
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
}


Vue.use(VueSocialauth, {
  providers: {
    google: {
      clientId:
        "179927047358-2tb2v90kjsclkmukob79p89gfpgmb7d8.apps.googleusercontent.com",
      redirectUri: "http://vue.article.com/callback/google" // Your client app URL
    }
  },
  bindRequestInterceptor: function($auth) {
    $auth.$http.interceptors.push((req, next) => {
      next();
    });
  },
  bindResponseInterceptor: function($auth) {
    $auth.$http.interceptors.push((req, next) => {
      next();
    });
  }
});

const router = new VueRouter({
  routes,
  mode: "history",
  renderSingle: true
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    if (!store.state.auth.token) {
      next("/login");
    } else {
      Vue.http.interceptors.push((request, next) => {
        request.headers.set(
          "Authorization",
          "Bearer " + store.state.auth.token
        );
        request.headers.set("Accept", "application/json");
        return next();
      });
    }
  } else if (to.meta.guest) {
    if (!store.state.auth.token) {
      return next();
    } else {
      store.state.auth.token = "";
      next("/home");
    }
    return next();
  } else {
    if (store.state.auth.token) {
      Vue.http.interceptors.push((request, next) => {
        request.headers.set(
          "Authorization",
          "Bearer " + store.state.auth.token
        );
        request.headers.set("Accept", "application/json");
        return next();
      });
    }
    return next();
  }
});

new Vue({
  el: "#app",
  store,
  router,
  vuetify: new Vuetify({
    icons: {
      iconfont: "mdi"
    }
  }),
  render: h => h(App),
  components: { App }
}).$mount("#app");

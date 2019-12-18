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
import "./registerServiceWorker";

Vue.use(Vuetify);
Vue.use(DataTable);

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.root = "http://article.com/api/";
Vue.config.productionTip = false;

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

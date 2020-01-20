import Vue from "vue";
import "babel-polyfill";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import App from "./App";
import {
	routes
} from "./router";
import "../public/assets/js/validatorFile";
//import VueSocialauth from "vue-social-auth";
import DataTable from "laravel-vue-datatable";
import store from "./store";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "./registerServiceWorker.js";

Vue.use(Vuetify);
Vue.use(DataTable);

Vue.use(VueRouter);
Vue.use(VueResource);
const url = "/api"
Vue.http.options.root = url;
Vue.config.productionTip = false;
const router = new VueRouter({
	routes,
	mode: 'history',
	renderSingle: true
});

router.beforeEach((to, from, next) => {
	Vue.http.interceptors.push((request, next) => {
		if (store.state.auth.token) {
			request.headers.set(
				"Authorization",
				"Bearer " + store.state.auth.token
			);
			request.headers.set("Accept", "application/json");
		}
		return next();
	});
	return next();
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
	components: {
		App
	}
}).$mount("#app");

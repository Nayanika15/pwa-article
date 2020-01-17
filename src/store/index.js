import Vue from "vue";
import Vuex from "vuex";
import auth from "./module/auth.js";
import home from "./module/home.js";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		auth,
		home
	}
});

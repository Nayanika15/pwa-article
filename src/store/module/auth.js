const state = {
  token: localStorage.getItem("token"),
  is_admin: localStorage.getItem("is_admin")
};

const mutations = {
  authenicated(state, { token, is_admin }) {
      localStorage.token = token;
      localStorage.is_admin = is_admin;
  },
  loggout()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
  }
};

const actions = {
  user_auth(state, { token, is_admin }) {
    state.commit("authenicated", { token, is_admin });
  },
  user_loggout(state) {
    state.commit("loggout");
  }
};

export default {
  state,
  actions,
  mutations
};

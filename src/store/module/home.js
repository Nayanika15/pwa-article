const state = {
	is_loading: false
};

const mutations = {
	loading(state, is_loading) {
		state.is_loading = is_loading;
	}
};

export default {
	state,
	mutations
};

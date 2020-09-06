export default {
  state: {
    searchParams: JSON.parse(localStorage.getItem('searchParams') || '[]'),
  },
  mutations: {
    setSearchParams(state, params) {
      state.searchParams = params;
      localStorage.setItem('searchParams', JSON.stringify(state.searchParams));
    },
  },
  actions: {
    setSearchParams({ commit }, params) {
      commit('setSearchParams', params);
    },
  },
  getters: {
    searchParams: (state) => state.searchParams,
  },
};

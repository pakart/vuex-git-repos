export default {
  state: {
    repos: [],
    repoDetails: [],
  },
  mutations: {
    updateRepos(state, repos) {
      state.repos = repos;
    },
    openRepoDetails(state, repo) {
      state.repoDetails = repo;
    },
  },
  actions: {
    async fetchRepos(ctx, url) {
      fetch(url)
        .then((response) => response.json())
        .then(
          (json) => {
            ctx.commit('updateRepos', json.items);
          },
        );
    },
    openRepoDetails({ commit }, repo) {
      commit('openRepoDetails', repo);
    },
  },
  getters: {
    allRepos: (state) => state.repos,
    repoDetails: (state) => state.repoDetails,
  },
};

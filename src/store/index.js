// TODO

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchParams: [],
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    searchParams: (s) => s.tasks,
  },
});

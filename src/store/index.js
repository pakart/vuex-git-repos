// TODO

import Vue from 'vue';
import Vuex from 'vuex';
import searchParams from './modules/searchParams';
import repos from './modules/repos';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    searchParams,
    repos,
  },
});

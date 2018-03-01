import Vue from 'vue';
import Vuex from 'vuex';
import area from './stores/area';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {area},
});

/*
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedVariables: {
      pair: 'STRATETH',
    },
  },
  getters: {
    getVariable(state, name) {
      const variable = state.selectedVariables[name];
      return variable || 'Выбрать значение';
    },
    getVariables: state => state.selectedVariables,
  },
  actions: {
    loadVariables(ctx, payload) {
      ctx.commit('loadVariable', payload);
    },
  },
  mutations: {
    loadVariable(state, payload) {
      state.selectedVariables = payload;
    },
  },
});
*/

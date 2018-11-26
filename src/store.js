import Vue from 'vue';
import Vuex from 'vuex';

import avaliacaoResultados from './store/avaliacaoResultados/index';
import autenticacao from './store/autenticacao/index';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'staging';

export default new Vuex.Store({
    modules: {
        avaliacaoResultados,
        autenticacao,
    },
    getters: {
        route: state => state.route,
    },
    strict: debug,
});





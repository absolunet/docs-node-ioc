import Vue from 'vue';
import App from './App';
import i18n from './translations';
import router from './router';

Vue.config.productionTip = false;

const render = h => h(App);

export default new Vue({ i18n, router, render });


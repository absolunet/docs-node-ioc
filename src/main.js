import Vue from 'vue';
import app from './lib';
import Home from './docs/Home';
import AuthorLogo from './docs/AuthorLogo';

Vue.component('home', Home);
Vue.component('author-logo', AuthorLogo);

app.$mount('#app');

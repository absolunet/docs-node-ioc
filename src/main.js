import Vue from 'vue';
import app from './lib';
import Home from './docs/Home';
import AuthorLogo from './docs/AuthorLogo';
import Logo from './docs/Logo';

Vue.component('home', Home);
Vue.component('logo', Logo);
Vue.component('author-logo', AuthorLogo);

app.$mount('#app');

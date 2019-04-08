import Vue from 'vue';
import app from './lib';
import Home from './docs/Home';

Vue.component('home', Home);

app.$mount('#app');

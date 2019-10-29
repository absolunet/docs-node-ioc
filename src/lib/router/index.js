import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

import removeTrailingSlash from './guards/remove-trailing-slash';
import ensureLocale from './guards/ensure-locale';

const guards = [
    removeTrailingSlash,
    ensureLocale
];

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});

guards.forEach(guard => router.beforeEach(guard));

export default router;

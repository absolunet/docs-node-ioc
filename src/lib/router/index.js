import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

import removeTrailingSlash from './guards/remove-trailing-slash';
import ensureLocale from './guards/ensure-locale';
import ensureExistingVersion from './guards/ensure-existing-version';
import redirectVersionRootToFirstPage from './guards/redirect-version-root-to-first-page';

const guards = [
    removeTrailingSlash,
    ensureLocale,
    ensureExistingVersion,
    redirectVersionRootToFirstPage
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

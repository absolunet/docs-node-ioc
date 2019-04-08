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
    routes: routes
});

guards.forEach(guard => router.beforeEach(guard));

export default router;

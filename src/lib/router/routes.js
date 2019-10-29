import HomePage from './../components/HomePage';
import DocPage from './../components/DocPage';
import basePath from './../../../base-path.config';

export default [
    {
        path: `${basePath}:locale`,
        name: 'home',
        component: HomePage
    },
    {
        path: `${basePath}:locale/*`,
        name: 'page',
        component: DocPage
    }
];

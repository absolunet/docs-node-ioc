import Page from './../components/Page';
import DocPage from './../components/DocPage';
import DocContent from './../components/DocContent';
import basePath from './../../../base-path.config';

export default [
    {
        path: `${basePath}:locale`,
        name: 'home',
        component: Page,
        children: [
            {
                path: ':version',
                name: 'version',
                component: DocPage,
                children: [
                    {
                        path: '*',
                        name: 'page',
                        component: DocContent
                    }
                ]
            }
        ]
    }
];

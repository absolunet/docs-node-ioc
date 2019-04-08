import Page from './../components/Page';
import DocPage from './../components/DocPage';
import DocContent from './../components/DocContent';

export default [
    {
        path: '/:locale',
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

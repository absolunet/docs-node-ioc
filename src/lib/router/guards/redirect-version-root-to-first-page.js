import menus from './../../.cache/menus';
import i18n from './../../translations';


export default (to, from, next) => {
    if (to.name === 'version') {
        let [{ children: items }] = menus.filter(({ name }) => name === to.params.version);
        let path = '/:version';
        while (items.length > 0 && items[0].children.length > 0) {
            const [item] = items;
            items = item.children;
            path += `/${item.name}`;
        }
        path += `/${items[0].name}`;

        const key = `path.original.${path}`;
        path = i18n.te(key) ? i18n.t(key) : path;

        path = `/${to.params.locale}${path.replace(':version', to.params.version)}`;

        next(path);
    } else {
        next();
    }
};

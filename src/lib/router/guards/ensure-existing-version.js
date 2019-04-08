import menus from './../../.cache/menus';

export default (to, from, next) => {
    if (!to.params.version) {
        next();
    } else {
        const { version } = to.params;
        if (menus.filter(({ name }) => name === version).length === 1) {
            next();
        } else {
            const newTo = Object.assign({}, to);
            newTo.params.version = menus.sort(({ name: a, name: b }) => parseFloat(b) - parseFloat(a))[0].name;
            next(newTo);
        }
    }
};

export default (to, from, next) => {
    const pathWithoutTrailingSlash = to.path.replace(/\/$/, '');

    if (Boolean(pathWithoutTrailingSlash) && pathWithoutTrailingSlash !== to.path) {
        next(pathWithoutTrailingSlash);
    } else {
        next();
    }
};

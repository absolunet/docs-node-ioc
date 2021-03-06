import i18n from '../../translations';

export default (to, from, next) => {
    if (!to.params.locale) {
        next({ name: 'home', params: { locale: i18n.fallbackLocale } });
    } else {
        i18n.locale = to.params.locale;
        next();
    }
};

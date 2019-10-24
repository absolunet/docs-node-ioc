import Vue from 'vue';
import VueI18n from 'vue-i18n';
import pages from './../.cache/docs';
import en from './../../translations/en';


Vue.use(VueI18n);

const locales = { en };


const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: Object.assign({}, pages)
});

Object.keys(locales).forEach((locale) => {
    const original = locales[locale].path || {};
    delete locales[locale].path;
    i18n.mergeLocaleMessage(locale, locales[locale]);

    const alias = {};
    Object.keys(original).forEach((o) => {
        alias[original[o]] = o;
    });
    i18n.mergeLocaleMessage(locale, { path: { original, alias } });
});


export default i18n;

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import pages from './../.cache/docs';
import en from './../../translations/en';
import fr from './../../translations/fr';


Vue.use(VueI18n);

const locales = { en, fr };


const i18n = new VueI18n({
    locale: 'fr',
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

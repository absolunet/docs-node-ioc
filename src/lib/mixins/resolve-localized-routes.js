export default {
    computed: {
        locale() {
            return this.$route.params.locale;
        },
        fallbackLocale() {
            return this.$i18n.fallbackLocale;
        },
        locales() {
            const locales = {};
            this.$i18n.availableLocales
            .filter(locale => locale !== this.locale)
            .forEach(locale => {
                locales[locale] = this.getCurrentPathAlias(locale);
            });

            return locales;
        },
        currentPathPattern() {
            return this.$route.path.replace(this.$route.matched[this.$route.matched.length - 1].regex, (path, ...matches) => {
                const params = {};
                Object.keys(this.$route.params).forEach(key => { params[this.$route.params[key]] = key; });

                return matches.reduce((str, match) => {
                    if (params[match] === 'pathMatch') {
                        return str;
                    }

                    const regex = new RegExp(`/${match}(/.*)?$`);

                    if (params[match] === 'locale') {
                        return str.replace(regex, '$1');
                    }

                    return str.replace(regex, `/:${params[match]}$1`);
                }, path);
            });
        },
        currentOriginalPathPattern() {
            const { currentPathPattern } = this;
            const key = `path.alias.${currentPathPattern}`;

            return this.$te(key) ? this.$t(key) : currentPathPattern;
        },
        currentLocalizedPath() {
            return this.getCurrentPathAlias();
        }
    },
    methods: {
        getCurrentPathAlias(locale = this.locale, withLocale = true) {
            return this.getPathAlias(this.currentOriginalPathPattern, locale, withLocale);

        },
        getPathAlias(path, locale = this.locale, withLocale = true) {
            const key = `path.original.${path}`;
            const alias = this.formatPathFromCurrent(this.$te(key, locale) ? this.$t(key, locale) : path, locale);

            return withLocale ? alias : this.removeLocaleFromPath(alias);
        },
        formatPathFromCurrent(path, locale = null)  {
            const { params } = this.$route;
            const formattedPath = Object.keys(params).reduce((str, paramName) => {
                return str.replace(new RegExp(`:${paramName}`, 'gu'), params[paramName]);
            }, path);

            return locale ? this.formatLocalePath(locale, formattedPath) : formattedPath;
        },
        formatLocalePath(locale, path) {
            return `/${locale}${path}`;
        },
        removeLocaleFromPath(path) {
            return this.$i18n.availableLocales.reduce((str, locale) => {
                return str.replace(new RegExp(`^/${locale}`), '');
            }, path);
        }
    }
}
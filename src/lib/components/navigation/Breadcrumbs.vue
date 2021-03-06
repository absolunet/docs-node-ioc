<template>
    <nav :aria-label="$t('You are here') + ':'" role="navigation">
        <ul class="breadcrumbs no-bullet">
            <li v-if="breadcrumbs.length > 0">
                <router-link :to="home" v-text="$t('Home')" />
            </li>
            <li v-for="(crumb, index) in breadcrumbs" :key="crumb.url" :class="{ disabled: !crumb.url}">
                <router-link v-if="index !== breadcrumbs.length - 1 && crumb.url" :to="crumb.url" v-text="crumb.label" />
                <span v-else-if="index !== breadcrumbs.length - 1" v-text="crumb.label" />
                <span v-else>
                    <span class="show-for-sr">Current: </span> {{ crumb.label }}
                </span>
            </li>
        </ul>
    </nav>
</template>

<script>
    import translatesMenu from './../../mixins/translates-menu';

    export default {
        mixins: [translatesMenu],
        computed: {
            home() {
                return { name: 'home', params: { locale: this.$route.params.locale } };
            },
            breadcrumbs() {
                const { path, params: { locale } } = this.$route;
                const unlocalizedPath = path.replace(new RegExp(`^(?:/)?[^/]*${locale}(?<slash>/)?`, 'u'), '$<slash>');
                const parts = unlocalizedPath.split('/').filter(Boolean);

                return parts
                    .map((currentPart, i) => {
                        const url = path.replace(`${unlocalizedPath}`, parts.slice(0, i + 1).reduce((str, part) => {
                            return `${str}/${part}`;
                        }, ''));

                        const label = this.getMenuLabel(currentPart);

                        const { locale } = this.$i18n;
                        if ((new RegExp(`\\/${locale}(?:\\/[\\w-]+)?\\/?$`, 'u')).test(url)) {
                            return { label };
                        }

                        return { url, label };
                    })
                    .filter((part, i, breadcrumbs) => {
                        return !breadcrumbs.slice(0, i - 1).some(({ url }) => {
                            return url === part.url;
                        }) && !this.$i18n.availableLocales.includes(part.label.toLowerCase());
                    });
            }
        }
    }
</script>

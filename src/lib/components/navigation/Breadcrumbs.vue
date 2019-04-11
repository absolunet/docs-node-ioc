<template>
    <nav :aria-label="$t('You are here') + ':'" role="navigation">
        <ul class="breadcrumbs">
            <li v-if="breadcrumbs.length > 0">
                <router-link :to="home" v-text="$t('Home')" />
            </li>
            <li v-for="(crumb,index) in breadcrumbs" :key="crumb.url">
                <router-link v-if="index !== breadcrumbs.length - 1" :to="crumb.url" v-text="crumb.label" />
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
                const { path, params:{ locale } } = this.$route;
                const unlocalizedPath = path.replace(new RegExp(`^(/)?.*${locale}(/)?`, 'u'), '$2');
                const parts = unlocalizedPath.split('/').filter((part) => { return Boolean(part); });
                const breadcrumbs = [];
                for(let i = 0; i < parts.length; i++) {
                    const url = path.replace(`${unlocalizedPath}`, parts.slice(0, i + 1).reduce((str, part) => {
                        return `${str}/${part}`;
                    }, ''));

                    const label = this.getMenuLabel(parts[i]);
                    breadcrumbs.push({ url, label });
                }

                return breadcrumbs;
            }
        }
    }
</script>
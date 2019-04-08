<template>
    <div class="top-bar">
        <div class="top-bar-left">
            <router-link :to="homePage"><img src="https://placehold.it/100x39" :alt="siteName" /></router-link>
        </div>
        <div class="top-bar-right">
            <ul class="menu">
                <li v-if="$te('app.repository')">
                    <a :href="$t('app.repository')" target="_blank" v-text="$t('View on GitHub')"></a>
                </li>
                <li v-if="versions.length > 0">
                    <dropdown>
                        <template v-slot:label>{{ version }}</template>
                        <ul>
                            <li v-for="{ to, label } in versions" :key="label">
                                <router-link :to="to" v-text="label" />
                            </li>
                        </ul>
                    </dropdown>
                </li>
                <li>
                    <language-switcher />
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Dropdown from './../../container/Dropdown';
    import LanguageSwitcher from './../../LanguageSwitcher';
    import menus from './../../../.cache/menus';

    export default {
        components: {
            Dropdown,
            LanguageSwitcher
        },
        computed: {
            homePage() {
                return { name: 'home', params: { locale: this.$route.params.locale } };
            },
            siteName() {
                return this.$t('app.name');
            },
            version() {
                return this.$route.params.version || 'Version';
            },
            versions() {
                const { locale } = this.$route.params;

                return menus
                    .filter(({ name: version }) => version !== this.version)
                    .map(({ name: version }) => ({
                        to: { name: 'version', params: { locale, version } },
                        label: version
                    }));
            }
        }
    }
</script>
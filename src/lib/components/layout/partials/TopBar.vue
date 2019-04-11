<template>
    <div class="top-bar">
        <div class="top-bar-left">
            <logo />
        </div>
        <div class="top-bar-right">
            <ul class="menu secondary">
                <li v-if="$te('app.repository')" class="show-for-medium">
                    <a :href="$t('app.repository')" target="_blank" class="github-link" v-text="$t('View on GitHub')"></a>
                </li>
                <li v-if="versions.length > 0">
                    <dropdown size="tiny" :options="{ alignment:'right' }">
                        <template v-slot:label>{{ version }}</template>
                        <ul class="vertical menu">
                            <li v-for="{ to, label } in versions" :key="label">
                                <router-link :to="to" v-text="label" />
                            </li>
                        </ul>
                    </dropdown>
                </li>
                <li>
                    <language-switcher :options="{ alignment:'right' }" />
                </li>
                <li class="hide-for-large">
                    <button class="button offcanvas-toggle" type="button" data-open="offCanvas">&nbsp;</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Dropdown from './../../container/Dropdown';
    import LanguageSwitcher from './../../LanguageSwitcher';
    import Logo from './Logo';
    import menus from './../../../.cache/menus';

    export default {
        components: {
            Dropdown,
            LanguageSwitcher,
            Logo
        },
        computed: {
            siteName() {
                return this.$t('app.name');
            },
            version() {
                return this.$route.params.version || this.$t('Ver.');
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

<style lang="scss">
    .top-bar {
        .secondary.menu {
            li {
                margin-left: .5em;
            }

            a, .button {
                padding: .7rem 1rem;
            }
        }
    }
</style>
<style lang="scss" scoped>
    @import './../../../config/design.scss';

    .offcanvas-toggle {
        position: relative;

        &::before {
            content: '';
            background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Cpath fill="%23#{str-slice("#{$button-color}", 2)}" d="m4,10l24,0c1.104,0 2,-0.896 2,-2s-0.896,-2 -2,-2l-24,0c-1.104,0 -2,0.896 -2,2s0.896,2 2,2zm24,4l-24,0c-1.104,0 -2,0.896 -2,2s0.896,2 2,2l24,0c1.104,0 2,-0.896 2,-2s-0.896,-2 -2,-2zm0,8l-24,0c-1.104,0 -2,0.896 -2,2s0.896,2 2,2l24,0c1.104,0 2,-0.896 2,-2s-0.896,-2 -2,-2z"%3E%3C/path%3E%3C/svg%3E\a');
            position: absolute;
            top: .55rem;
            left: .5rem;
            width: 1.25rem;
            height: 1.25rem;
        }
    }

    .github-link {
        position: relative;

        &::before {
            content: '';
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23#{str-slice("#{$anchor-color}", 2)}' d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'%3E%3C/path%3E%3C/svg%3E\a");
            position: absolute;
            top: .5em;
            left: -1em;
            width: 1.5em;
            height: 1.5em;
            transition: background-image .1s;
        }

        &:hover {
            &::before {
                background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23#{str-slice("#{$anchor-color-hover}", 2)}' d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'%3E%3C/path%3E%3C/svg%3E\a");
            }
        }
    }
</style>
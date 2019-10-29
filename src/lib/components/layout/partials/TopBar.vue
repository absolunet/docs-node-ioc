<template>
    <div class="top-bar" ref="topBar">
        <div class="top-bar-wrapper grid-container">
            <div class="top-bar-left">
                <logo />
            </div>
            <div class="top-bar-right">
                <ul class="menu secondary no-bullet">
                    <li v-if="$te('app.repository')">
                        <a :href="$t('app.repository')" target="_blank" class="github-link">
                            <span class="github-text" v-text="$t('View on GitHub')"/>
                        </a>
                    </li>
                    <li>
                        <language-switcher :options="{ alignment:'right' }" />
                    </li>
                    <li class="hide-for-large offcanvas-toggle-wrapper">
                        <button class="offcanvas-toggle" type="button" data-open="offcanvas-main-menu"></button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import Foundation from 'foundation-sites';
    import LanguageSwitcher from './../../LanguageSwitcher';
    import Logo from './Logo';

    export default {
        components: {
            LanguageSwitcher,
            Logo
        },
        data: () => ({
            $sticky: null
        }),
        computed: {
            siteName() {
                return this.$t('app.name');
            }
        },
        mounted() {
            this.$sticky = new Foundation.Sticky($(this.$refs.topBar), {
                stickyOn: 'small',
                marginTop: 0
            });
        }
    }
</script>

<style lang="scss">
    .top-bar {
        .secondary.menu {
            a, .button {
                padding: .7rem 1rem;
            }
        }
    }
</style>

<style lang="scss" scoped>
    @import './../../../config/design.scss';
    $alt-small-breakpoint: 425px;

    .top-bar {
        box-shadow: 0 0 5px rgba($black, 0.25);
    }

    .top-bar-wrapper {
        display: flex;
        width: 100%;
        align-items: center;
    }

    .offcanvas-toggle-wrapper {
        align-self: center;
    }

    .offcanvas-toggle {
        position: relative;
        width: 1.25em;
        height: 1.25em;
        vertical-align: text-bottom;

        &::before {
            content: '';
            background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Cpath fill="%23#{str-slice("#{$primary-color}", 2)}" d="m4,10l24,0c1.104,0 2,-0.896 2,-2s-0.896,-2 -2,-2l-24,0c-1.104,0 -2,0.896 -2,2s0.896,2 2,2zm24,4l-24,0c-1.104,0 -2,0.896 -2,2s0.896,2 2,2l24,0c1.104,0 2,-0.896 2,-2s-0.896,-2 -2,-2zm0,8l-24,0c-1.104,0 -2,0.896 -2,2s0.896,2 2,2l24,0c1.104,0 2,-0.896 2,-2s-0.896,-2 -2,-2z"%3E%3C/path%3E%3C/svg%3E\a');
            position: absolute;
            top: 0;
            left: 0;
            width: 1.25rem;
            height: 1.25rem;
        }
    }

    .github-link {
        margin-right: .5em;
        position: relative;

        &::before {
            content: '';
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23#{str-slice("#{$anchor-color}", 2)}' d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'%3E%3C/path%3E%3C/svg%3E\a");
            position: absolute;
            top: 0;
            left: 0;
            width: 1.5em;
            height: 1.5em;
            transition: background-image .1s;
        }

        &:hover {
            &::before {
                background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23#{str-slice("#{$anchor-color-hover}", 2)}' d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'%3E%3C/path%3E%3C/svg%3E\a");
            }
        }

        @media screen and (min-width: $alt-small-breakpoint) {
            margin: 0;

            &::before {
                top: .5em;
                left: -1em;
            }
        }

        @include breakpoint(large) {
            .secondary.menu & {
                padding-right: 0;
            }
        }
    }

    .github-text {
        display: none;

        @media screen and (min-width: $alt-small-breakpoint) {
            display: inline;
        }
    }
</style>

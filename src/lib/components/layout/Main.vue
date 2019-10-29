<template>
    <div>
        <off-canvas name="main-menu">
            <template v-slot:offcanvas>
                <div class="card">
                    <div class="card-section">
                        <h1 class="h2 separator-center margin-vertical-1" v-text="siteName"></h1>
                    </div>
                </div>
                <sections-menu />
            </template>
            <top-bar />
            <main class="main">
                <slot />
            </main>
            <small-footer />
        </off-canvas>
    </div>
</template>

<script>
    import OffCanvas from './../container/OffCanvas';
    import SectionsMenu from './../navigation/SectionsMenu';
    import SmallFooter from './partials/SmallFooter';
    import TopBar from './partials/TopBar';

    export default {
        components: {
            OffCanvas,
            SectionsMenu,
            SmallFooter,
            TopBar
        },
        computed: {
            siteName() {
                return this.$t('app.name');
            }
        }
    }
</script>

<style lang="scss">
    @import '../../config/design';
    @import '~foundation-sites/scss/foundation';
    @import '../../../styles/code';

    @include foundation-everything($prototype: true);

    code {
        overflow-wrap: break-word;
    }

    ul:not(.no-bullet) {
        list-style: none;

        li {
            padding-left: 1em;
            position: relative;
        }


        li::before {
            content: "\2022";
            color: $primary-color;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>

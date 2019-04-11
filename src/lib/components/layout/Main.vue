<template>
    <div>
        <off-canvas>
            <template v-slot:offcanvas>
                <div class="logo-container">
                    <logo />
                    <h1 class="h2 doc-name" v-text="siteName"></h1>
                </div>
                <sections-menu />
            </template>
            <top-bar />
            <slot />
            <small-footer />
        </off-canvas>
    </div>
</template>

<script>
    import Logo from './partials/Logo';
    import OffCanvas from './../container/OffCanvas';
    import SectionsMenu from './../navigation/SectionsMenu';
    import SmallFooter from './partials/SmallFooter';
    import TopBar from './partials/TopBar';

    export default {
        components: {
            Logo,
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

    @include foundation-everything();
</style>

<style lang="scss" scoped>
    @import '../../config/design';

    .logo-container {
        padding: 1em;
        background-color: $card-background;
        text-align: center;
    }

    .logo, .doc-name {
        display: block;
        margin: $subheader-margin-bottom auto;
    }
</style>

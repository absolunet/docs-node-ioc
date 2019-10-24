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
            <slot />
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
</style>

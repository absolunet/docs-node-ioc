<template>
    <div>
        <main-menu />
        <slot />
    </div>
</template>

<script>
    import MainMenu from './partials/MainMenu';

    export default {
        components: {
            MainMenu
        }
    }
</script>

<style lang="scss">
    @import '../../config/design';
    @import '~foundation-sites/scss/foundation';
    @import '~highlight.js/styles/github.css';

    @include foundation-everything();
</style>

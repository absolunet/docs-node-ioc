<template>
    <div>
        <div v-if="content" class="doc-content-wrapper">
            <h1 v-text="title" class="doc-title"></h1>
            <hr />
            <nav v-if="menu && menu.length > 0">
                <doc-page-menu :menu="menu" />
                <hr />
            </nav>
            <div class="doc-content" v-html="content"></div>
        </div>
        <div v-else class="not-found" v-text="$t('error.404')"></div>
    </div>
</template>

<script>
    import hasLocalizedContent from './../mixins/has-localized-content';
    import DocPageMenu from './navigation/DocPageMenu';

    export default {
        mixins: [hasLocalizedContent],
        components: {
            DocPageMenu
        }
    }
</script>

<style lang="scss" scoped>
    @import './../config/design';

    .doc-title {
        margin-bottom: 0;

        + hr {
            margin-top: nth($hr-margin, 1) / 4;
        }
    }
</style>
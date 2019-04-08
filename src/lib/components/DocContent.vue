<template>
    <div>
        <div v-if="content">
            <h1 v-text="title"></h1>
            <nav v-if="menu && menu.length > 0">
                <doc-page-menu :menu="menu" />
            </nav>
            <div v-html="content"></div>
        </div>
        <div v-else v-text="$t('error.404')"></div>
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

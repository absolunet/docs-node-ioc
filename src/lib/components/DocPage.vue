<template>
    <div class="grid-container margin-top-2">
        <div class="grid-x grid-margin-x">
            <div class="large-3 cell show-for-large">
                <sections-menu />
            </div>
            <div class="large-9 cell">
                <breadcrumbs />
                <doc-content />
            </div>
        </div>
    </div>
</template>

<script>
    import Breadcrumbs from './navigation/Breadcrumbs';
    import SectionsMenu from './navigation/SectionsMenu';
    import DocContent from './DocContent';

    export default {
        components: {
            Breadcrumbs,
            SectionsMenu,
            DocContent
        }
	};
</script>

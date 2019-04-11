<template>
    <div class="grid-container">
        <div class="grid-x grid-margin-x">
            <div class="large-3 cell show-for-large">
                <sections-menu />
            </div>
            <div class="large-9 cell">
                <breadcrumbs />
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
    import Breadcrumbs from './navigation/Breadcrumbs';
    import SectionsMenu from './navigation/SectionsMenu';

    export default {
        components: {
            Breadcrumbs,
            SectionsMenu
        }
    };
</script>

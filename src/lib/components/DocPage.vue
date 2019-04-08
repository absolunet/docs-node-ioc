<template>
    <div>
        <div class="grid-x">
            <div class="medium-3 large-2 cell">
                <sections-menu />
            </div>
            <div class="medium-7 large-6 large-offset-1 cell">
                <breadcrumbs />
                <router-view />
            </div>
            <div class="medium-2">
                <sidebar />
            </div>
        </div>
    </div>
</template>

<script>
    import Breadcrumbs from './navigation/Breadcrumbs';
    import SectionsMenu from './navigation/SectionsMenu';
    import Sidebar from './navigation/Sidebar';

    export default {
        components: {
            Breadcrumbs,
            SectionsMenu,
            Sidebar
        }
    };
</script>

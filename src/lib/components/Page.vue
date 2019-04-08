<template>
    <main class="main">
        <div v-show="!isHome" class="content">
            <router-view />
        </div>
        <div v-show="isHome">
            <home />
        </div>
    </main>
</template>

<script>
    export default {
        computed: {
            isHome() {
                return this.$route.name === 'home';
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import './../config/design';

    .content {
        padding: $global-padding $topbar-padding;
    }
</style>
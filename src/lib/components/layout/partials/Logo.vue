<template>
    <router-link :to="homePage" class="logo">
        <logo :alt="siteName" />
    </router-link>
</template>

<script>
    export default {
        computed: {
            homePage() {
                return { name: 'home', params: { locale: this.$route.params.locale } };
            },
            siteName() {
                return this.$t('app.name');
            }
        }
    }
</script>

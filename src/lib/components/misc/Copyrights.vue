<template>
    <span>&copy; {{ date }}</span>
</template>

<script>
    export default {
        computed: {
            date() {
                const now = new Date();
                const since = this.$te('app.date.since') ? this.$t('app.date.since') : now.getFullYear();
                const to = this.$te('app.date.to') ? this.$t('app.date.to') : now.getFullYear();

                return `${since}${since.toString() === to.toString() || parseInt(since) >= parseInt(to) ? '' : `-${to}`}`;
            }
        }
    }
</script>

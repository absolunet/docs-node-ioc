<template>
    <div>
        <div class="jumbotron" style="background-image:url('https://via.placeholder.com/1920x400')">
            <div class="grid-container">
                <div class="grid-x align-center text-center">
                    <div class="cell medium-10 large-8">
                        <h2>{{ $t('A complete NodeJS ecosystem with an elegant syntax for sparkling ideas') }}</h2>
                        <router-link class="button" :to="docLink" v-text="$t('Get started!')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            docLink() {
                return `${this.$route.path}/master`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .jumbotron {
        background: no-repeat center center;
        background-size: cover;
    }
</style>

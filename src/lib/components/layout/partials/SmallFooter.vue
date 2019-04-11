<template>
    <footer>
        <license />&nbsp;<copyrights />
        <span class="made">
            {{ $t('Made with') }} <span class="catch-phrase" v-text="catchPhrase"></span> {{ $t('by') }}
            <a :href="$t('app.author.link')" rel="external" target="_blank">
                <author-logo />
                {{ $t('app.author.name') }}
            </a>
        </span>
    </footer>
</template>

<script>
    import Copyrights from './../../misc/Copyrights';
    import License from './../../misc/License';

    export default {
        data: () => ({
            catchPhrase: ''
        }),
        components: {
            License,
            Copyrights
        },
        mounted() {
            this.updateCatchPhrase();
        },
        watch: {
            '$route.params.locale'() {
                this.updateCatchPhrase();
            }
        },
        methods: {
            updateCatchPhrase() {
                const { locale } = this.$i18n;
                const { catchPhrases = {} } = this.$i18n.messages[locale] || {};
                const phrases = Object.values(catchPhrases);
                this.catchPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './../../../config/design.scss';

    $background: $secondary-color;
    $color: color-pick-contrast($background, ($white, $black));

    footer {
        vertical-align: middle;
        text-align: center;
        padding: 1em 0;
        background-color: $background;
        color: $color;
    }

    .made {
        &::before {
            content: '•';
            margin: 0 1em;
        }
    }

    a {
        color: $color;
    }

    .catch-phrase {
        color: $primary-color;
    }
</style>
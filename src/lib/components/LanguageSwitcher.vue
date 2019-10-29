<template>
    <dropdown v-if="hasMultipleLocales" size="tiny" :options="options">
        <template v-slot:label>{{ upper(locale) }}</template>
        <ul class="vertical menu no-bullet">
            <li v-for="(to, label) in locales" :key="label">
                <router-link :to="to" v-text="upper(label)" />
            </li>
        </ul>
    </dropdown>
</template>

<script>
    import resolveLocalizedRoutes from './../mixins/resolve-localized-routes';
    import Dropdown from './container/Dropdown';

    export default {
        mixins: [resolveLocalizedRoutes],
        components: {
            Dropdown
        },
        props: {
            options: {
                type: Object,
                required: false,
                default: () => ({})
            }
        },
        computed: {
            hasMultipleLocales() {
                return Object.keys(this.locales).length > 0;
            }
        },
        methods: {
            upper(str) {
                return str.toUpperCase();
            }
        }
    }
</script>

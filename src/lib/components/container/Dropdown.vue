<template>
    <span>
        <button class="button is-dropdown-submenu-parent" :data-toggle="id" type="button">
            <slot name="label" />
        </button>
        <div ref="dropdown" class="dropdown-pane" :id="id" data-auto-focus="true">
            <slot />
        </div>
    </span>
</template>

<script>
    import $ from 'jquery';
    import Foundation from 'foundation-sites';

    export default {
        data: () => ({
            $dropdown: null
        }),
        computed: {
            id() {
                return `dropdown-${this._uid}`;
            }
        },
        props: {
            options: {
                type: Object,
                required: false,
                default: () => ({})
            }
        },
        mounted() {
            const options = Object.assign({
                closeOnClick: true
            }, this.options);

            this.$dropdown = new Foundation.Dropdown($(this.$refs.dropdown), options);
        }
    }
</script>
<template>
    <div>
        <div class="off-canvas position-left" :id="'offcanvas-' + this.name" ref="offCanvas">
            <slot name="offcanvas" />
        </div>
        <div class="off-canvas-content" data-off-canvas-content>
            <slot />
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import Foundation from 'foundation-sites';

    export default {
        props: {
            name: String
        },
        data: () => ({
            $offCanvas: null
        }),
        mounted() {
            this.$offCanvas = new Foundation.OffCanvas($(this.$refs.offCanvas), {
                transition: 'overlap',
                contentScroll: false
            });
        },
        watch: {
            $route() {
                if (this.$offCanvas) {
                    this.$offCanvas.close();
                }
            }
        }
    }
</script>

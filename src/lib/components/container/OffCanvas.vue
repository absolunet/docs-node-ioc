<template>
    <div>
        <div class="off-canvas position-left" id="offCanvas" ref="offCanvas">
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
        data: () => ({
            $offCanvas: null
        }),
        mounted() {
            this.$offCanvas = new Foundation.OffCanvas($(this.$refs.offCanvas), {
                transition: 'overlap',
                contentScroll: false
            });
        }
    }
</script>
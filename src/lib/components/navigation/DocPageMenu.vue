<template>
    <ul class="vertical menu no-bullet">
        <li v-for="(item,i) in menu" :key="`${i}-${item.anchor}`">
            <a :href="`#${item.anchor}`" v-text="item.label"></a>
            <doc-page-menu v-if="item.children && item.children.length> 0" :menu="item.children" class="nested" />
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'doc-page-menu',
        props: {
            menu: {
                type: Array,
                required: false,
                default: () => []
            }
        }
    }
</script>

<style scoped>
    .menu a {
        display: inline-block;
    }
</style>

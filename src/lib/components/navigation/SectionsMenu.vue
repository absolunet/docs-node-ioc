<template>
    <nav>
        <template v-for="(menu,index) in menus">
            <div class="card" v-if="menu.children.length > 0" :key="index">
                <div class="card-divider">
                    <h2 class="h6" v-text="getMenuLabel(menu.name)" />
                </div>
                <div class="card-section">
                    <ul class="vertical menu no-bullet">
                        <li v-for="{ name } in menu.children" :key="name">
                            <router-link :to="buildLinkFromMenu(menu, name)" v-text="getMenuLabel(name)" />
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    </nav>
</template>

<script>
    import menus from './../../.cache/menus';
    import resolveLocalizedRoutes from './../../mixins/resolve-localized-routes';
    import translatesMenu from './../../mixins/translates-menu';

    export default {
        mixins: [resolveLocalizedRoutes, translatesMenu],
        computed: {
            menus() {
                return menus;
            }
        },
        methods: {
            buildLinkFromMenu(menu, name = null) {
                return this.getPathAlias(`/${menu.name}/${name || menu.children[0].name}`);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .router-link-active {
        position: relative;

        &::before {
            content: '\02022';
            position: absolute;
            left: 0;
            top: .5em;
        }
    }
</style>

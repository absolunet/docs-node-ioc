<template>
    <div>
        <template v-for="(menu,index) in menus">
            <div class="card" v-if="menu.children.length > 0" :key="index">
                <div class="card-divider">
                    <router-link :to="buildLinkFromMenu(menu)" v-text="getMenuLabel(menu.name)"/></div>
                <div class="card-section">
                    <ul>
                        <li v-for="{ name } in menu.children" :key="name">
                            <router-link :to="buildLinkFromMenu(menu, name)" v-text="getMenuLabel(name)" />
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import menus from './../../.cache/menus';
    import resolveLocalizedRoutes from './../../mixins/resolve-localized-routes';
    import translatesMenu from './../../mixins/translates-menu';

    export default {
        mixins: [resolveLocalizedRoutes, translatesMenu],
        computed: {
            menus() {
                return menus.filter(({ name }) => name === this.$route.params.version)[0].children;
            }
        },
        methods: {
            buildLinkFromMenu(menu, name = null) {
                return this.getPathAlias(`/:version/${menu.name}/${name || menu.children[0].name}`);
            }
        }
    }
</script>

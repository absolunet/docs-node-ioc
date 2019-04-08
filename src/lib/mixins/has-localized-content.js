import $ from 'jquery';
import removeAccent from 'remove-accents';
import resolveLocalizedRoutes from './resolve-localized-routes';
import to from 'to-case';
import translatesMenu from './translates-menu';
const titleSelector = 'h1,h2,h3,h4,h5,h6';

export default {
    mixins: [resolveLocalizedRoutes, translatesMenu],
    computed: {
        content() {
            const { contentKey } = this;

            const content = this.$te(contentKey) ? this.$t(contentKey) : null;
            if (!content) {
                return content;
            }

            const $content = $(content);
            const ids = [];
            $content.find(titleSelector).each(function() {
                const $this = $(this);
                const slug = to.slug(removeAccent($this.text()));
                let id = slug;
                let index = 1;
                while (ids.indexOf(id) > -1) {
                    id = `${slug}-${index++}`;
                }
                ids.push(id);
                $this.attr('id', id);
            });

            return $content.wrap('<div>').parent().html();
        },
        contentKey() {
            return `content.${this.getCurrentPathAlias(this.fallbackLocale, false).slice(1).replace(/\//gu, '__').replace(/[.-]/gu, '_')}`;
        },
        title() {
            return this.getMenuLabel(this.getCurrentPathAlias().split('/').reverse()[0]);
        },
        menu() {
            const { content } = this;
            if (!content) {
                return null;
            }

            const menu = [];

            $(content).find(titleSelector).each(function() {
                const $this = $(this);
                const level = parseInt(this.tagName.charAt(1)) - 1;
                let items = menu;
                for(let i = 1; i < level; i++) {
                    items = items[items.length - 1].children;
                }
                items.push({ label: $this.text(), anchor: to.slug(removeAccent($this.text())), children: [] });
            });

            return menu;
        }
    }
}
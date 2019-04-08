import to from 'to-case';


export default {
    methods: {
        getMenuLabel(item) {
            const key = `menu.${item}`;
            if (this.$te(key)) {
                return this.$t(key);
            }

            return isNaN(item) ? to.sentence(item) : item;
        }
    }
};

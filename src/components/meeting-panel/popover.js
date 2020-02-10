import PopOver from './popover.class';
import toolpopMixin from './tooltip';

export default {
    mixins: [toolpopMixin],
    render(h) {
        return h(
            'div',
            {
                class: ['d-none'],
                style: { display: 'none' },
                attrs: { 'aria-hidden': true },
            },
            [
                h('div', { ref: 'title' }, this.$slots.title),
                h('div', { ref: 'content' }, this.$slots.default),
            ],
        );
    },
    data() {
        return {};
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        triggers: {
            type: [String, Array],
            default: 'click',
        },
        placement: {
            type: String,
            default: 'right',
        },
    },
    methods: {
        createToolpop() {
            // getTarget is in toolpop mixin
            console.log('createToolpop');
            const target = this.getTarget();
            if (target) {
                this._toolpop = new PopOver(target, this.getConfig(), this.$root);
            } else {
                this._toolpop = null;
                console.warn('[Bootstrap-Vue warn]: b-popover: \'target\' element not found!');
            }
            return this._toolpop;
        },
    },
};

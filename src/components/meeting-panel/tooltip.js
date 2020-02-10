/*
 * Tooltip/Popover component mixin
 * Common props
 */
import { isArray, assign } from 'lodash';

const isSSR = typeof window === 'undefined';
const HTMLElement = isSSR ? Object : window.HTMLElement;
const getById = id => document.getElementById(/^#/.test(id) ? id.slice(1) : id) || null;
const isElement = el => el && el.nodeType === Node.ELEMENT_NODE;
export function observeDom(el, callback, opts) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const eventListenerSupported = window.addEventListener;

    // Handle case where we might be passed a vue instance
    el = el ? (el.$el || el) : null;
    /* istanbul ignore next: dificult to test in JSDOM */
    if (!isElement(el)) {
        // We can't observe somthing that isn't an element
        return null;
    }

    let obs = null;

    /* istanbul ignore next: difficult to test in JSDOM */
    if (MutationObserver) {
        // Define a new observer
        obs = new MutationObserver((mutations) => {
            let changed = false;
            // A Mutation can contain several change records, so we loop through them to see what has changed.
            // We break out of the loop early if any "significant" change has been detected
            for (let i = 0; i < mutations.length && !changed; i++) {
                // The muttion record
                const mutation = mutations[i];
                // Mutation Type
                const { type } = mutation;
                // DOM Node (could be any DOM Node type - HTMLElement, Text, comment, etc)
                const { target } = mutation;
                if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
                    // We ignore nodes that are not TEXt (i.e. comments, etc) as they don't change layout
                    changed = true;
                } else if (type === 'attributes') {
                    changed = true;
                } else if (type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    // This includes HTMLElement and Text Nodes being added/removed/re-arranged
                    changed = true;
                }
            }
            if (changed) {
                // We only call the callback if a change that could affect layout/size truely happened.
                callback();
            }
        });

        // Have the observer observe foo for changes in children, etc
        obs.observe(el, assign({ childList: true, subtree: true }, opts));
    } else if (eventListenerSupported) {
        // Legacy interface. most likely not used in modern browsers
        el.addEventListener('DOMNodeInserted', callback, false);
        el.addEventListener('DOMNodeRemoved', callback, false);
    }

    // We return a reference to the observer so that obs.disconnect() can be called if necessary
    // To reduce overhead when the root element is hiiden
    return obs;
}
const PLACEMENTS = {
    top: 'top',
    topleft: 'topleft',
    topright: 'topright',
    right: 'right',
    righttop: 'righttop',
    rightbottom: 'rightbottom',
    bottom: 'bottom',
    bottomleft: 'bottomleft',
    bottomright: 'bottomright',
    left: 'left',
    lefttop: 'lefttop',
    leftbottom: 'leftbottom',
    auto: 'auto',
};

const OBSERVER_CONFIG = {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'style'],
};

export default {
    props: {
        target: {
            // String ID of element, or element/component reference
            type: [String, Object, HTMLElement, Function],
        },
        delay: {
            type: [Number, Object, String],
            default: 0,
        },
        offset: {
            type: [Number, String],
            default: 0,
        },
        noFade: {
            type: Boolean,
            default: false,
        },
        container: {
            // String ID of container, if null body is used (default)
            type: String,
            default: null,
        },
        boundary: {
            // String: scrollParent, window, or viewport
            // Element: element reference
            type: [String, Object],
            default: 'scrollParent',
        },
        show: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        show(show, old) {
            console.log(show, old, show === old);
            if (show === old) {
                return;
            }
            show ? this.onOpen() : this.onClose();
        },
        disabled(disabled, old) {
            if (disabled === old) {
                return;
            }
            disabled ? this.onDisable() : this.onEnable();
        },
        target(va, old) {
            if (!va && old) {
                this.$off('open', this.onOpen);
                this.$off('close', this.onClose);
                this.$off('disable', this.onDisable);
                this.$off('enable', this.onEnable);
                this.setObservers(false);
                // bring our content back if needed
                this.bringItBack();
                if (this._toolpop) {
                    this._toolpop.destroy();
                    this._toolpop = null;
                }
            } else if (va && !old) {
                this.createdPop();
            } else if (old) {
                this.$off('open', this.onOpen);
                this.$off('close', this.onClose);
                this.$off('disable', this.onDisable);
                this.$off('enable', this.onEnable);
                this.setObservers(false);
                // bring our content back if needed
                this.bringItBack();
                if (this._toolpop) {
                    this._toolpop.destroy();
                    this._toolpop = null;
                }
                this.createdPop();
            }
        },
    },
    created() {
        // Create non-reactive property
        this._toolpop = null;
        this._obs_title = null;
        this._obs_content = null;
    },
    mounted() {
        // We do this in a next tick to ensure DOM has rendered first

    },
    updated() {
        // If content/props changes, etc
        if (this._toolpop) {
            this._toolpop.updateConfig(this.getConfig());
        }
    },
    /* istanbul ignore next: not easy to test */
    activated() {
        // Called when component is inside a <keep-alive> and component brought offline
        this.setObservers(true);
    },
    /* istanbul ignore next: not easy to test */
    deactivated() {
        // Called when component is inside a <keep-alive> and component taken offline
        if (this._toolpop) {
            this.setObservers(false);
            this._toolpop.hide();
        }
    },
    /* istanbul ignore next: not easy to test */
    beforeDestroy() {
        // Shutdown our local event listeners
        this.$off('open', this.onOpen);
        this.$off('close', this.onClose);
        this.$off('disable', this.onDisable);
        this.$off('enable', this.onEnable);
        this.setObservers(false);
        // bring our content back if needed
        this.bringItBack();
        if (this._toolpop) {
            this._toolpop.destroy();
            this._toolpop = null;
        }
    },
    computed: {
        baseConfig() {
            const cont = this.container;
            const delay = (typeof this.delay === 'object') ? this.delay : (parseInt(this.delay, 10) || 0);
            return {
                // Title prop
                title: (this.title || '').trim() || '',
                // Contnt prop (if popover)
                content: (this.content || '').trim() || '',
                // Tooltip/Popover placement
                placement: PLACEMENTS[this.placement] || 'auto',
                // Container curently needs to be an ID with '#' prepended, if null then body is used
                container: cont ? (/^#/.test(cont) ? cont : `#${cont}`) : false,
                // boundariesElement passed to popper
                boundary: this.boundary,
                // Show/Hide delay
                delay: delay || 0,
                // Offset can be css distance. if no units, pixels are assumed
                offset: this.offset || 0,
                // Disable fade Animation?
                animation: !this.noFade,
                // Open/Close Trigger(s)
                trigger: isArray(this.triggers) ? this.triggers.join(' ') : this.triggers,
                // Callbacks so we can trigger events on component
                callbacks: {
                    show: this.onShow,
                    shown: this.onShown,
                    hide: this.onHide,
                    hidden: this.onHidden,
                    enabled: this.onEnabled,
                    disabled: this.onDisabled,
                },
            };
        },
    },
    methods: {
        createdPop() {
            this.$nextTick(() => {
                // Instantiate ToolTip/PopOver on target
                // The createToolpop method must exist in main component
                if (this.createToolpop()) {
                    if (this.disabled) {
                        // Initially disabled
                        this.onDisable();
                    }
                    // Listen to open signals from others
                    this.$on('open', this.onOpen);
                    // Listen to close signals from others
                    this.$on('close', this.onClose);
                    // Listen to disable signals from others
                    this.$on('disable', this.onDisable);
                    // Listen to disable signals from others
                    this.$on('enable', this.onEnable);
                    // Observe content Child changes so we can notify popper of possible size change
                    this.setObservers(true);
                    // Set intially open state
                    if (this.show) {
                        this.onOpen();
                    }
                }
            });
        },
        getConfig() {
            const cfg = assign({}, this.baseConfig);
            if (this.$refs.title && this.$refs.title.innerHTML.trim()) {
                // If slot has content, it overrides 'title' prop
                // We use the DOM node as content to allow components!
                cfg.title = this.$refs.title;
                cfg.html = true;
            }
            if (this.$refs.content && this.$refs.content.innerHTML.trim()) {
                // If slot has content, it overrides 'content' prop
                // We use the DOM node as content to allow components!
                cfg.content = this.$refs.content;
                cfg.html = true;
            }
            return cfg;
        },
        onOpen() {
            if (this._toolpop) {
                this._toolpop.show();
            }
        },
        onClose(callback) {
            if (this._toolpop) {
                this._toolpop.hide(callback);
            } else if (typeof callback === 'function') {
                callback();
            }
        },
        onDisable() {
            if (this._toolpop) {
                this._toolpop.disable();
            }
        },
        onEnable() {
            if (this._toolpop) {
                this._toolpop.enable();
            }
        },
        updatePosition() {
            if (this._toolpop) {
                // Instruct popper to reposition popover if necessary
                this._toolpop.update();
            }
        },
        getTarget() {
            let { target } = this;
            if (typeof target === 'function') {
                target = target();
            }
            if (typeof target === 'string') {
                // Assume ID of element
                return getById(target);
            } if (typeof target === 'object' && isElement(target.$el)) {
                // Component reference
                return target.$el;
            } if (typeof target === 'object' && isElement(target)) {
                // Element reference
                return target;
            }
            return null;
        },
        onShow(evt) {
            this.$emit('show', evt);
        },
        onShown(evt) {
            this.setObservers(true);
            this.$emit('update:show', true);
            this.$emit('shown', evt);
        },
        onHide(evt) {
            this.$emit('hide', evt);
        },
        onHidden(evt) {
            this.setObservers(false);
            // bring our content back if needed to keep Vue happy
            // Tooltip class will move it back to tip when shown again
            this.bringItBack();
            this.$emit('update:show', false);
            this.$emit('hidden', evt);
        },
        onEnabled(evt) {
            if (!evt || evt.type !== 'enabled') {
                // Prevent possible endless loop if user mistakienly fires enabled instead of enable
                return;
            }
            this.$emit('update:disabled', false);
            this.$emit('disabled');
        },
        onDisabled(evt) {
            if (!evt || evt.type !== 'disabled') {
                // Prevent possible endless loop if user mistakienly fires disabled instead of disable
                return;
            }
            this.$emit('update:disabled', true);
            this.$emit('enabled');
        },
        bringItBack() {
            // bring our content back if needed to keep Vue happy
            if (this.$el && this.$refs.title) {
                this.$el.appendChild(this.$refs.title);
            }
            if (this.$el && this.$refs.content) {
                this.$el.appendChild(this.$refs.content);
            }
        },
        /* istanbul ignore next: not easy to test */
        setObservers(on) {
            if (on) {
                if (this.$refs.title) {
                    this._obs_title = observeDom(this.$refs.title, this.updatePosition.bind(this), OBSERVER_CONFIG);
                }
                if (this.$refs.content) {
                    this._obs_content = observeDom(this.$refs.content, this.updatePosition.bind(this), OBSERVER_CONFIG);
                }
            } else {
                if (this._obs_title) {
                    this._obs_title.disconnect();
                    this._obs_title = null;
                }
                if (this._obs_content) {
                    this._obs_content.disconnect();
                    this._obs_content = null;
                }
            }
        },
    },
};

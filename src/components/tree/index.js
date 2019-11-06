import ylTree from './tree.vue';
/* istanbul ignore next */
ylTree.install = function (Vue) {
  Vue.component(ylTree.name, ylTree);
};

export default ylTree;

<style lang="scss">
// @import './tree.scss';
</style>
<template>
  <div>
    <div :class="customClass" v-loading="treeLoading">
      <div class="tool-bar clearfix" v-if="isShowTool">
        <span class="title">{{title}}</span>
        <button
          class="btn"
          :class="{'is-disabled':tool.up}"
          :disabled="tool.up"
          @click.prevent="moveUp"
        >{{t('el.tree.moveUp',language)}}</button>
        <button
          class="btn"
          :class="{'is-disabled':tool.down}"
          :disabled="tool.down"
          @click.prevent="moveDown"
        >{{t('el.tree.moveDown',language)}}</button>
      </div>
      <yl-input
        :language="language"
        v-show="isShowSearch"
        :loading="loading"
        ref="ylInput"
        :placeholder="$t('yl.tree.placeholder')"
        @blur="onSearchBlur"
        @input="enterCheck"
        @change="setSearchValue"
        :maxlength="128"
      ></yl-input>
      <div :id="treeId" class="nl-tree"></div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import InfiniteTree from "./lib/infinite-tree";
import ylInput from "./input.vue";
import nbTree from "./treeMan";
import t from "./i18n";
import { flattenTree, uniqBy } from "./utils";

export default {
  components: {
    ylInput
  },
  name: "ylTree",
  provide() {
    return { parent: this };
  },
  props: {
    language: {
      type: String,
      default() {
        return "zh-CN";
      }
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    isShowSearch: {
      type: Boolean,
      default: true
    },
    isShowTool: {
      type: Boolean,
      default: false
    },
    title: String,
    customClass: String,
    remoteMethod: Function,
    rowRenderer: {
      type: Function
    },
    searchRender: Function,
    loadNodes: {
      type: Function,
      default() {}
    },
    props: {
      type: Object,
      default() {
        return {
          autoOpen: false,
          checkedBox: false
        };
      }
    },
    limitCheck: {
      type: Function
    },
    isDrapable: {
      type: Boolean,
      default: false
    },
    checkFilter: {
      type: Function,
      default(v) {
        return true;
      }
    },
    custom: {
      type: Object
    },
    loadOnDemand: {
      type: Function,
      default(v) {
        return false;
      }
    },
    filterNodeKey: {
      type: Array,
      default() {
        return ["name"];
      }
    },
    moveAble: {
      type: Function,
      default(node, value = true) {
        return value;
      }
    },
    muldepart: {
      type: Boolean,
      default: false
    },
    formatData: {
      type: Function,
      default(v) {
        return {};
      }
    },
    theme: {
      type: String
    }
  },
  data() {
    return {
      t,
      treeId: `tree${new Date().valueOf()}`,
      search: "",
      loading: typeof this.remoteMethod !== "undefined",
      checkedList: new Map(),
      isHasSlot: !!this.$slots.default,
      defaultCustom: {
        id: "id",
        parentId: "parentId",
        label: "name"
      },
      tempData: [],
      tool: {
        up: true,
        down: true
      },
      treeLoading: false
    };
  },
  created() {
    this.defaultCustom = Object.assign({}, this.defaultCustom, this.custom);
  },
  mounted() {
    this.treeLoading = true;
    this.initTree();
  },
  beforeDestroy() {
    nbTree.removeTree(this.treeId);
    this.checkedList.clear();
  },
  methods: {
    updateTree(data, defaultChecks) {
      this.treeLoading = true;
      nbTree.clearTree(this.treeId);
      this.checkedList.clear();
      this.loadTree(data, defaultChecks);
      this.treeLoading = false;
    },
    flattenRoot() {
      let tem = [];
      const roots = nbTree.getTree(this.treeId).getRootNode().children;
      roots.forEach(node => {
        tem = [...tem, ...flattenTree(node, "children")];
      });
      return tem;
    },
    flattenTree(id) {
      const node = nbTree.getTree(this.treeId).getNodeById(id);
      return id
        ? node
          ? flattenTree(node, "children")
          : []
        : this.flattenRoot();
    },
    arrayToTree(items = [], defaultChecked = []) {
      console.time("array");
      const rootItems = [];
      const lookup = {};
      for (let _i = 0, items_1 = items; _i < items_1.length; _i++) {
        items[_i].state = {};
        items[_i].loadOnDemand = this.loadOnDemand(items[_i]);
        !items[_i].hasOwnProperty("id") &&
          (items[_i].id = items[_i][this.defaultCustom.id]);
        Object.assign(items[_i], this.formatData(items[_i]));
        items[_i].checkIndex = -1;
        const checkIndex = defaultChecked.indexOf(
          items[_i][this.defaultCustom.id]
        );
        if (checkIndex > -1) {
          items[_i].state.checked = true;
          items[_i].checkIndex = checkIndex;
          this.checkedList.set(items[_i][this.defaultCustom.id], items[_i]);
        }
        const item = items_1[_i];
        const itemId = item[this.defaultCustom.id];
        const parentId = item[this.defaultCustom.parentId];
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
          lookup[itemId] = { ...item, children: [] };
        } else if (!lookup[itemId].hasOwnProperty(this.defaultCustom.id)) {
          Object.assign(lookup[itemId], item);
        }
        const TreeItem = lookup[itemId];
        if (!parentId) {
          rootItems.push(TreeItem);
        } else {
          if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
            lookup[parentId] = { children: [] };
          }
          TreeItem.id = item.id; // id 唯一标识，如果一对多id会被覆盖。
          lookup[parentId].children.push(TreeItem);
        }
      }
      console.timeEnd("array");
      return rootItems;
    },
    initTree() {
      const curDrop = this.isDrapable
        ? {
            hoverClass: "infinite-tree-drop-hover",
            accept: (event, opts) => {
              const { type, draggableTarget, droppableTarget, node } = opts;
              return true;
            },
            drop: (event, opts) => {
              const { draggableTarget, droppableTarget, node } = opts;
              const target = nbTree
                .getTree(this.treeId)
                .getNodeById(draggableTarget.getAttribute("data-id"));
              nbTree.getTree(this.treeId).removeNode(target);
              nbTree.getTree(this.treeId).insertNodeBefore(target, node);
            }
          }
        : {};
      const isRender =
        typeof this.rowRenderer === "function"
          ? { rowRenderer: this.rowRenderer }
          : {};
      const checkable =
        typeof this.limitCheck === "function"
          ? { checkAble: this.limitCheck }
          : {};
      nbTree.addTree(
        this.treeId,
        new InfiniteTree({
          el: document.querySelector(`#${this.treeId}`),
          ...isRender,
          ...checkable,
          droppable: curDrop,
          ...this.props,
          shouldLoadNodes(parentNode) {
            if (!parentNode.hasChildren() && parentNode.loadOnDemand) {
              return true;
            }
            return false;
          },
          nodeIdAttr: "data-id", // the node id attribute
          noDataText: this.$t("noData.null"),
          loadNodes: (parentNode, next) => {
            parentNode.state.loading = true;
            this.loadNodes(parentNode, next);
          }
        })
      );
      this.addEvent();
    },
    removeNode(id) {
      const cu = id
        ? nbTree.getTree(this.treeId).getNodeById(id)
        : nbTree.getTree(this.treeId).getSelectedNode();
      nbTree.getTree(this.treeId).removeNode(cu);
    },
    appendNode(id, newNode) {
      const parent = id
        ? nbTree.getTree(this.treeId).getNodeById(id)
        : nbTree.getTree(this.treeId).getSelectedNode();
      nbTree.getTree(this.treeId).appendChildNode(newNode, parent);
    },
    getSelectNodeIndex() {
      const node = nbTree.getTree(this.treeId).getSelectedNode();
      return node && node.parent
        ? {
            currentIndex: nbTree
              .getTree(this.treeId)
              .getChildNodes(node.parent)
              .findIndex(
                it => it[this.defaultCustom.id] == node[this.defaultCustom.id]
              ),
            node
          }
        : { currentIndex: -1, node: {} };
    },
    moveUp() {
      const { currentIndex, node } = this.getSelectNodeIndex();
      const targetIndex = currentIndex - 1;
      if (targetIndex > -1) {
        nbTree.getTree(this.treeId).moveNodeTo(node, node.parent, targetIndex);
        nbTree.getTree(this.treeId).selectNode(node);
      }
    },
    moveDown() {
      const { currentIndex, node } = this.getSelectNodeIndex();
      const targetIndex = currentIndex + 1;
      if (node.parent.children.length > targetIndex) {
        nbTree.getTree(this.treeId).moveNodeTo(node, node.parent, targetIndex);
        nbTree.getTree(this.treeId).selectNode(node);
      }
    },
    onSearchBlur() {
      setTimeout(() => {
        this.search = "";
        this.$refs.ylInput.setValue(this.search);
        this.$refs.ylInput.doDestroy();
      }, 350);
    },
    openParents(node) {
      const { depth } = node.state;
      const parentNode = [];
      const pNode = (parentNode, i, node) => {
        if (i > 0 && node.parent) {
          i--;
          parentNode.unshift(node.parent);
          return pNode(parentNode, i, node.parent);
        }
        return parentNode;
      };
      return pNode(parentNode, depth, node);
    },
    enterCheck(v) {
      this.enterSearch(v);
    },
    enterSearch(v, value = true) {
      const currentNode = nbTree.getTree(this.treeId).getNodeById(v.id);
      const pnodes = this.openParents(currentNode);
      pnodes.forEach(it => {
        !it.state.open && nbTree.getTree(this.treeId).openNode(it);
      });
      this.muldepart
        ? this.mulCheck(currentNode)
        : nbTree.getTree(this.treeId).checkNode(currentNode, value);
      nbTree.getTree(this.treeId).selectNode(currentNode);
      this.$emit("selectNode", currentNode);
      nbTree.getTree(this.treeId).scrollToNode(currentNode);
      this.onSearchBlur();
    },
    mulCheck(currentNode) {
      const { id } = this.defaultCustom;
      const mulNodes = nbTree
        .getTree(this.treeId)
        .filterNodes(node => node[id] == currentNode[id]);
      this.props.checkedBox &&
        mulNodes.forEach(cnode => {
          !cnode.disabled &&
            nbTree
              .getTree(this.treeId)
              .checkNode(cnode, !cnode.state.checked, this.checkStrictly);
        });
    },
    mulEvent() {
      nbTree.getTree(this.treeId).on("click", event => {
        const currentNode = nbTree
          .getTree(this.treeId)
          .getNodeFromPoint(event.clientX, event.clientY);
        if (!currentNode) {
          return;
        }
        event.stopPropagation();
        if (
          event.target.className.includes("infinite-tree-toggler") ||
          !event.target.className.includes("el-checkbox__inner")
        ) {
          nbTree.getTree(this.treeId).toggleNode(currentNode);
          this.$emit("toggle-node", currentNode);
        } else {
          nbTree.getTree(this.treeId).selectNode(currentNode);
          this.mulCheck(currentNode);
          this.$emit("selectNode", currentNode);
        }
      });
    },
    singleEvent() {
      nbTree.getTree(this.treeId).on("click", event => {
        const currentNode = nbTree
          .getTree(this.treeId)
          .getNodeFromPoint(event.clientX, event.clientY);
        if (!currentNode) {
          return;
        }
        event.stopPropagation();
        if (
          event.target.className.includes("infinite-tree-toggler") ||
          event.target.className.includes("el-icon-caret")
        ) {
          nbTree.getTree(this.treeId).toggleNode(currentNode);
          this.$emit("toggle-node", currentNode);
        } else {
          nbTree.getTree(this.treeId).selectNode(currentNode);
          console.log(event.target.className);
          if (
            currentNode.children.length > 0 &&
            !event.target.className.includes("el-checkbox__inner")
          ) {
            nbTree.getTree(this.treeId).toggleNode(currentNode);
          } else if (!currentNode.disabled && this.props.checkedBox) {
            nbTree
              .getTree(this.treeId)
              .checkNode(
                currentNode,
                !currentNode.state.checked,
                this.checkStrictly
              );
          }
          this.$emit("selectNode", currentNode);
        }
      });
    },
    addEvent() {
      nbTree.getTree(this.treeId).on("checkNode", node => {
        const result = nbTree
          .getTree(this.treeId)
          .flattenNode(node)
          .filter(n => this.checkFilter(n));
        result.forEach(it => {
          if (it.state.checked) {
            this.checkedList.set(it[this.defaultCustom.id], it);
          } else {
            this.checkedList.delete(it[this.defaultCustom.id]);
          }
        });
        if (this.isHasSlot) {
          this.$slots.default[0].componentInstance.$emit(
            "update",
            Array.from(this.checkedList.values())
          );
        }
        this.$emit("checkNode", result, node);
      });
      this.muldepart ? this.mulEvent() : this.singleEvent();
      nbTree.getTree(this.treeId).on("selectNode", node => {
        if (!node) return;
        const { currentIndex } = this.getSelectNodeIndex();
        this.tool.up = this.moveAble(node, !(currentIndex - 1 > -1));
        this.tool.down = this.moveAble(
          node,
          !(node.parent.children.length > currentIndex + 1)
        );
      });
    },
    _filterFun(node) {
      let _exits = false;
      let value = "";
      try {
        value = this.search.toLowerCase();
      } catch (e) {
        value = this.search;
      }
      for (let i = 0; i < this.filterNodeKey.length; i++) {
        if (
          node[this.filterNodeKey[i]] &&
          node[this.filterNodeKey[i]].toLowerCase().includes(value)
        ) {
          _exits = true;
          break;
        }
      }
      return _exits;
    },
    async setSearchValue(v) {
      this.search = v;
      let data = [];
      if (typeof this.remoteMethod === "function") {
        data = await this.remoteMethod(v);
      } else {
        data = this.tempData.filter(node => this._filterFun(node));
      }
      data = this.muldepart ? uniqBy(data, this.defaultCustom.id) : data;
      if (data.length > 200) {
        data = data.slice(0, 200);
      }
      data.forEach((item, index) => {
        if (typeof this.searchRender === "function") {
          item.html = this.searchRender(item, index);
        } else {
          item.html = `<span title="${
            item[this.defaultCustom.label]
          }" data-index=${index} >${item[this.defaultCustom.label]}</span>`;
        }
      });
      this.$refs.ylInput.setOptions(data);
    },
    updateSearchData(data) {
      this.tempData = Array.isArray(data)
        ? Object.freeze(JSON.parse(JSON.stringify(data)))
        : Object.freeze(this.flattenTree());
    },
    loadTree(userdata = [], defaultChecked = []) {
      try {
        this.tempData = Object.freeze(JSON.parse(JSON.stringify(userdata)));
        const datas = this.arrayToTree(userdata, defaultChecked);
        nbTree.getTree(this.treeId).loadData(datas);
        this.tempData.length &&
          this.openNode(this.tempData[0][this.defaultCustom.id]);
        if (this.isHasSlot) {
          this.$slots.default[0].componentInstance.$emit(
            "update",
            Array.from(this.checkedList.values()).sort(
              (a, b) => a.checkIndex - b.checkIndex
            )
          );
        }
      } finally {
        this.treeLoading = false;
      }
    },
    openNode(id) {
      const node = id
        ? nbTree.getTree(this.treeId).getNodeById(id)
        : nbTree.getTree(this.treeId).getRootNode();
      nbTree.getTree(this.treeId).openNode(node);
    },
    checkNode(id, value) {
      const node = nbTree.getTree(this.treeId).getNodeById(id);
      node && nbTree.getTree(this.treeId).checkNode(node, value);
    },
    selectNode(id) {
      const node = nbTree.getTree(this.treeId).getNodeById(id);
      node &&
        !node.state.selected &&
        nbTree.getTree(this.treeId).selectNode(node);
    },
    updateNode(id, obj) {
      const node = nbTree.getTree(this.treeId).getNodeById(id);
      node && nbTree.getTree(this.treeId).updateNode(node, obj, {});
    },
    getChecked() {
      return this.checkedList;
    },
    scrollTop(value) {
      nbTree.getTree(this.treeId).scrollTop(value);
    }
  }
};
</script>

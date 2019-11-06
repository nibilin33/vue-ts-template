<style lang="scss">
</style>
<template>
    <div class="search-input">
        <div>
            <i class="el-icon-search"></i>
            <input type="text" class="el-input__inner"
                :class="`is-${ size }`"
                @focus="handleFoucs"
                @blur="handleBlur"
                :disabled="disabled"
                :placeholder="placeholder"
                @keydown.down.prevent="navigateOptions('next')"
                @keydown.up.prevent="navigateOptions('prev')"
                @keydown.enter.prevent="selectOption"
                @keydown.esc.stop.prevent="visible = false"
                :maxlength="maxlength"
                v-model="value"
                ref="input">
            <i v-if="iconstatus" @click="handleIconClick" class="iconfont icon-btn_delete"></i>
        </div>
        <transition name="el-zoom-in-top" @after-leave="doDestroy" @after-enter="handleMenuEnter">
            <div class="el-select-dropdown" style="width:100%" ref="popper" @click="clickOption($event)" v-show="visible">
                <el-scrollbar tag="ul" wrap-class="el-select-dropdown__wrap" view-class="el-select-dropdown__list" :class="{ 'is-empty':filteredOptionsCount === 0 }" v-show="options.length > 0 && !loading">
                    <li v-for="(it,index) in options" :data-index="index" :class="{'activeTr':index == hoverIndex}" :id="it.id" :key="index" v-html="it.html"></li>
                </el-scrollbar>
                <p v-if="loading" class="loading">loading...</p>
                <p class="el-select-dropdown__empty" v-if="emptyText && options.length === 0">{{ emptyText }}</p>
            </div>
        </transition>
    </div>
</template>
<script>
import t from './i18n';

export default {
  props: {
    name: String,
    size: {
      type: String,
      default() {
        return 'small';
      },
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    placeholder: {
      type: String,
      default() {
        return '';
      },
    },
    maxlength: {
      type: Number,
      default() {
        return 64;
      },
    },
    language: {
      type: String,
      default() {
        return 'zh';
      },
    },
  },
  name: 'ylInput',
  data() {
    return {
      t,
      value: '',
      iconstatus: '',
      dropdownUl: null,
      bottomOverflow: 0,
      topOverflow: 0,
      selected: {},
      options: [],
      filteredOptionsCount: 0,
      visible: false,
      hoverIndex: 0,
    };
  },
  watch: {
    value(value) {
      this.visible = !!value;
      this.$emit('change', value);
    },
  },
  computed: {
    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('el.select.loading', this.language);
      }
      if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
        return this.noMatchText || this.t('el.select.noMatch', this.language);
      }
      if (this.options.length === 0) {
        return this.noDataText || this.t('el.select.noData', this.language);
      }

      return null;
    },
  },
  methods: {
    resetScrollTop() {
      const current = document.getElementById(this.options[this.hoverIndex].id);
      const bottomOverflowDistance = current.getBoundingClientRect().bottom
                - this.$refs.popper.getBoundingClientRect().bottom;
      const topOverflowDistance = current.getBoundingClientRect().top
                - this.$refs.popper.getBoundingClientRect().top;
      if (bottomOverflowDistance > 0) {
        this.dropdownUl.scrollTop += bottomOverflowDistance;
      }
      if (topOverflowDistance < 0) {
        this.dropdownUl.scrollTop += topOverflowDistance;
      }
    },
    setOptions(data) {
      this.options = data;
      this.filteredOptionsCount = data.length;
      this.handleMenuEnter();
    },
    resetMenuScroll() {
      if (this.bottomOverflow > 0) {
        this.dropdownUl.scrollTop += this.bottomOverflow;
      } else if (this.topOverflow < 0) {
        this.dropdownUl.scrollTop += this.topOverflow;
      }
    },
    handleMenuEnter() {
      this.hoverIndex = 0;
      if (!this.dropdownUl) {
        this.dropdownUl = this.$refs.popper.querySelector('.el-select-dropdown__wrap');
      }
      this.dropdownUl.scrollTop = 0;
      if (this.dropdownUl) {
        this.resetMenuScroll();
      }
    },
    doDestroy() {
      this.visible = false;
      this.hoverIndex = 0;
      this.dropdownUl = null;
    },
    handleOptionSelect(option) {
      this.$emit('input', this.options[this.hoverIndex]);
    },
    clickOption(e) {
      this.hoverIndex = Number(e.target.getAttribute('data-index'));
      this.selectOption();
    },
    selectOption() {
      this.$refs.input.focus();
      if (this.options[this.hoverIndex]) {
        this.handleOptionSelect(this.options[this.hoverIndex]);
      }
    },
    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.options.length === 0) return;
      if (direction === 'next') {
        this.hoverIndex++;
        if (this.hoverIndex === this.options.length) {
          this.hoverIndex = 0;
        }
        this.resetScrollTop();
      }
      if (direction === 'prev') {
        this.hoverIndex--;
        if (this.hoverIndex < 0) {
          this.hoverIndex = this.options.length - 1;
        }
        this.resetScrollTop();
      }
    },
    handleFoucs(e) {
      this.iconstatus = 'close';
      this.visible = !!this.value;
    },
    handleBlur() {
      this.iconstatus = '';
      this.$emit('blur');
    },
    setValue(value) {
      this.value = value;
    },
    handleIconClick() {
      this.doDestroy();
      this.$refs.input.focus();
      this.handleBlur();
    },
  },
};
</script>

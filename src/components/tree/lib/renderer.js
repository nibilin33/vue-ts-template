/* eslint import/prefer-default-export: 0 */

const defaultRowRenderer = (node, treeOptions) => {
  const {
    id, name, loadOnDemand = false, children, state, props = {}, disabled = false, chkDisabled = false, avatar, gender, type,
  } = node;
  const { droppable, checkedBox } = treeOptions;
  const {
    depth, open, path, total, selected = false, filtered, checked, indeterminate,
  } = state;
  const childrenLength = Object.keys(children).length;
  const more = node.hasChildren();
  if (filtered === false) {
    return;
  }

  let togglerContent = '';
  if (!more && loadOnDemand) {
    togglerContent = '<span class="el-icon-caret-right"></span>';
  }
  if (more && open) {
    togglerContent = '<span class="el-icon-caret-bottom"></span>';
  }
  if (more && !open) {
    togglerContent = '<span class="el-icon-caret-right"></span>';
  }
  let toggleClass = '';
  if (!more && loadOnDemand) {
    toggleClass = `${treeOptions.togglerClass} infinite-tree-closed`;
  }
  if (more && open) {
    toggleClass = `${treeOptions.togglerClass}`;
  }
  if (more && !open) {
    toggleClass = `${treeOptions.togglerClass} infinite-tree-closed`;
  }

  const toggler = childrenLength == 0 && !loadOnDemand ? '<span style="margin-left:6px;">&nbsp;</span>' : `<a class='${toggleClass}'>${togglerContent}</a>`;
  const checkbox = checkedBox ? `<span aria-checked="mixed" class="el-checkbox__input ${indeterminate ? 'is-indeterminate' : checked ? 'is-checked' : ''} ${chkDisabled ? 'is-disabled' : ''} "><span class="el-checkbox__inner"></span><input type='checkbox' ${checked ? 'checked' : ''} ${chkDisabled ? 'disabled' : ''} data-checked=${checked} data-indeterminate=${indeterminate} class="el-checkbox__original"></input></span>` : '';
  const title = `<span class='infinite-tree-title'title=${name} style="padding-left:5px;">${name}</span>`;
  const loadingIcon = `${state.loading ? '<span class="el-icon-loading"></span>' : ''}`;
  let first = name;
  first = first.replace(/\(.*\)|（.*）$/g, '').split('').pop();
  const icon = avatar ? `<img src="${avatar}" style="width:25px;height:25px;border-radius:50%;margin-bottom:-7px;margin-left:3px;"></>` : ` <span class="${type + (gender === 0 ? 0 : 1)}_ico_docu"  data-title="${first}" ></span>`;
  const treeNode = `<div class='infinite-tree-node' style='margin-left:${depth * 18}px'>${toggler + checkbox + icon + title + loadingIcon}</div>`;
  const renderHtml = `
         <div 
         draggable=true 
         droppable=${droppable}
         data-id=${id}
         data-expanded=${more && open}
         data-depth=${depth}
         data-selected=${selected}
         data-children=${childrenLength}
         data-total=${total}
         class="infinite-tree-item ${selected ? 'infinite-tree-selected' : ''}">${treeNode}</div>
    `;
  return renderHtml;
};

export {
  defaultRowRenderer,
};

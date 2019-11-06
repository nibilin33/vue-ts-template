
## 重要说明
所有的方法的使用，需要确保树是否加载好
## Tree 的引用
如果项目组件库是使用element-ui ，可以直接import 使用，否则使用打包后的tree.vue.js  
该组件支持单个打包 webpack src/components/tree/index.js --config src/components/tree/webpack.tree.config.js --colors --progress --profile
==项目babel-loader要注意排除再次解析==
```javascript
    {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        exclude: [
          resolve('src/components/dist')
        ]
      }
```
install.js 文件，将组件的依赖搬到项目的package.json。只需要执行 node xx/xx/tree/install.js
可以加到script 里面 node xxx && npm i 执行搬迁和装依赖
## Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。需要有唯一标识属性id。

### 基础用法

基础的树形结构展示。

::: demo
```html
<style lang="scss">
.yl-tree{
    width:250px;
    display:inline-block;
    float: left;
    border: 1px solid #ebeef5;
    padding:10px;
}
</style>
     <yl-tree custom-class="yl-tree" ref="tree">
    </yl-tree>

<script>
  export default {
    data() {
      return {
        data: [{ "id": "f4a4a4ee02ac4bb8875bbd08e03d4de0", "parentId": null, 
        "name": "105测试", "namePinyin": "105ceshi", "namePinyinAlia": "105cs", "namePinyinPrefixAlia": null, 
        "index": 1, "type": "ORG", "account": null, "email": "admin@yealink.com", "extension": null, 
        "isOnline": false, "extraAttributes": null,
         "nameWithEmail": "105测试(admin@yealink.com)" }],
      };
    },
    mounted(){
        this.$refs.tree.loadTree(this.data);
    },
  };
</script>
```
:::

### 异步加载

适用于需要选择层级时使用。通过loadOnDemand方法做基本判断，是父节点的节点增加可下拉的按钮。由于在点击时才进行该层数据的获取，导致层级不可预知，如果没有下层数据，则点击后下拉按钮会消失。

::: demo
```html
       <yl-tree custom-class="yl-tree" ref="tree" :loadNodes="loadNodes" :loadOnDemand="loadOnDemand">

        </yl-tree>

<script>
  export default {
    data() {
      return {
      };
    },
     mounted(){
        this.$refs.tree.loadTree(this.data);
    },
    methods: {
        loadNodes(parentNode, next){
            const nodes = [];
            if(this.showDialog){
                nodes.length = 1000;
                for (let i = 0; i < nodes.length; ++i) {
                    nodes[i] = {
                        id: `${parentNode.id}.${i}`,
                        name: `testby-${i}`,
                        loadOnDemand: false,
                        type: 'STAFF',
                        parentId: parentNode.id
                    };
                }
            }
            this.showDialog = false;
            parentNode.loadOnDemand = this.showDialog;
            next(null, nodes, () => {
                // Completed
                parentNode.state.loading = false;
            });
        },
        loadOnDemand(n){
            return n.type == 'ORG';
        },
    }
  };
</script>
```
:::
### 组合树---穿梭框

树的右侧面板可以通过slot注入组件，注入的组件需要监听update事件，接收tree组件选择的变化。该组件可以通过inject注入parent,获得树的所有方法以及数据。通过checkFilter决定需要记录的勾选的节点。

::: demo
```html
    <yl-tree custom-class="yl-tree" ref="tree" :props="{checkedBox:true}" :checkFilter="checkFilter">
        <left slot></left>
    </yl-tree>

<script>
  import left from './panel-right.vue';
  export default {
    components: {
       left
    },
    data() {
      return {
      };
    },
     mounted(){
        this.$refs.tree.loadTree(this.data);
    },
    methods: {
        checkFilter(node){
            if(node.type !='ORG'){
                return true;
            }
        }
    }
  };
</script>
```
### 禁止勾选某节点
只要传入的数据结构中加入disabled
例如：
[{ "id": "f4a4a4ee02ac4bb8875bbd08e03d4de0", disabled:true, "parentId": null, "name": "105测试" }]

### 下拉树---多选，无关联
通过data传递数据，department 为true时，不做父子关联勾选，默认关联

::: demo
```html
<dropTree v-model="dropTree" :data="data" department multiple></dropTree>

<script>
  export default {
    data() {
      return {
        dropTree:[]
      };
    }
  };
</script>
```
:::
### 下拉树---单选
::: demo
```html
<dropTree v-model="dropTree" :data="data"></dropTree>

<script>
  export default {
    data() {
      return {
        dropTree:""
      };
    }
  };
</script>
```
### 自定义节点内容
节点的内容支持自定义

::: demo 使用`rowRenderer`指定渲染函数，该函数返回需要的节点区内容即可。
```html
     <yl-tree custom-class="yl-tree" ref="tree" :row-renderer="rowRender">
      </yl-tree>

<script>

  export default {
    data() {
      return {
        data:[]
      }
    },
    mounted(){
        this.$refs.tree.loadTree(this.data);
    },
    methods: {
    rowRender(node, treeOptions){
    const { id, name, loadOnDemand = false, children, state, props = {}, disabled = false } = node;
    const { droppable, checkedBox } = treeOptions;

    const { depth, open, path, total, selected = false, filtered, checked, indeterminate } = state;
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
    const checkbox = checkedBox ? `<span aria-checked="mixed" class="el-checkbox__input 
    ${indeterminate ? 'is-indeterminate' : checked ? 'is-checked' : ''}
     ${disabled ? 'is-disabled' : ''} "><span class="el-checkbox__inner">
     </span><input type='checkbox' ${checked ? 'checked' : ''} 
     ${disabled ? 'disabled' : ''} data-checked=${checked} 
     data-indeterminate=${indeterminate} class="el-checkbox__original">
     </input></span>` : '';
    const title = `<span class='infinite-tree-title' style="padding-left:5px;">${name}</span>`
    const loadingIcon = `${state.loading ? '<span class="el-icon-loading"></span>' : ''}`;
    let first = node.name;
    first = first.replace(/\(.*\)|（.*）$/g, "").split("").pop();
    let avatar = node.avatar ? `<span style="display: inline-block;vertical-align: 
    bottom;background:url(${node.avatar}) no-repeat center;background-size:cover;border-radius:50%;width:20px;height:20px;"></span>`
     : `<span data-title = ${first} class='STAFF${node.gender === 0 ? 0 : 1}_ico_docu'></span>`
    const icon = node.type != 'ORG' ? avatar : '';
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
    `
    return renderHtml;
},
    }
  };
</script>
```
### 树勾选限制
```html
     <yl-tree custom-class="yl-tree" ref="tree":limit-check="checkAble" >
      </yl-tree>

<script>

  export default {
    data() {
      return {
        data:[]
      }
    },
    mounted(){
    },
    methods: {
    checkAble(node,value){
        let currentChecked = this.$refs.tree.getChecked().size;
        let newLen = value ? node.length:0;
        let isError = currentChecked + newLen > 10;
        isError&&this.$message.error("勾选不能超过10");
        return !isError;
    },
    }
  };
</script>
```
### 树的一对多关系
```html
     <yl-tree custom-class="yl-tree" ref="tree" muldepart >
      </yl-tree>

<script>

  export default {
    data() {
      return {
        data:[{
            "partyId": "86fedac783df4f24891e8ee1ffe0defa",
            "id": "b9281cc619f7406da9513be6d3e6ff5f",
            "createTime": 1552957715643,
            "modifyTime": 1552957715648,
            "parentDataId": "f242594ba68f4127af1a30edaf142cd8",
            "index": 715827882,
            "dataId": "4df3383b0cf640a691f35368129244ab",
            "type": 0,
            "name": "Oda Fay II",
            "namePinyin": "Oda Fay II",
            "namePinyinForSearch": "ofii,oda fii,oda fay ii",
            "mobile": null,
            "email": "05765-test@yealink.com",
            "title": "programer",
            "gender": 1,
            "number": null
            }, {
            "partyId": "86fedac783df4f24891e8ee1ffe0defa",
            "id": "b9281cc619f7406da9513be6d3e6ff6f",
            "createTime": 1552957715643,
            "modifyTime": 1552957715648,
            "parentDataId": "647dcdea1f09443eb2d9c19e9f614bab",
            "index": 715827882,
            "dataId": "4df3383b0cf640a691f35368129244ab",
            "type": 0,
            "name": "Oda Fay II",
            "namePinyin": "Oda Fay II",
            "namePinyinForSearch": "ofii,oda fii,oda fay ii",
            "mobile": null,
            "email": "05765-test@yealink.com",
            "title": "programer",
            "gender": 1,
            "number": null
            }, {
            "partyId": "86fedac783df4f24891e8ee1ffe0defa",
            "id": "2b8bb6284a3e41cf9d18f3a3e2d08d9f",
            "createTime": 1552957712061,
            "modifyTime": 1552957712062,
            "parentDataId": null,
            "index": 1073741823,
            "dataId": "f242594ba68f4127af1a30edaf142cd8",
            "type": 200,
            "name": "根节点xxx",
            "namePinyin": null,
            "namePinyinForSearch": null,
            "mobile": null,
            "email": null,
            "title": null,
            "gender": null,
            "number": null
            }, {
            "partyId": "86fedac783df4f24891e8ee1ffe0defa",
            "id": "343012d2ff6a47ec885d0d091b95b8cd",
            "createTime": 1552980151854,
            "modifyTime": 1552980151854,
            "parentDataId": "5e24707b84214e27aecdb14b5f97acff",
            "index": 1073741823,
            "dataId": "3b29726e724f44c19a9849868d01e9e9",
            "type": 100,
            "name": "版本",
            "namePinyin": "BanBen",
            "namePinyinForSearch": "bb,banb,banben",
            "mobile": null,
            "email": null,
            "title": null,
            "gender": null,
            "number": null
            }, {
            "partyId": "86fedac783df4f24891e8ee1ffe0defa",
            "id": "e612049907e545419a67b4df6afebba4",
            "createTime": 1552966340424,
            "modifyTime": 1552966340424,
            "parentDataId": "647dcdea1f09443eb2d9c19e9f614bab",
            "index": 1073741823,
            "dataId": "a847c93ff7b945e0857d4321a32bfe3a",
            "type": 0,
            "name": "啊实打实",
            "namePinyin": "AShiDaShi",
            "namePinyinForSearch": "asds,asds,ashidashi",
            "mobile": "13960307532",
            "email": "liangf@yealink.com",
            "title": "前端",
            "gender": 1,
            "number": null
            }, {
            "partyId": "86fedac783df4f24891e8ee1ffe0defa",
            "id": "5928ba74435f42189bdd5d1fedb1bdce",
            "createTime": 1552957714837,
            "modifyTime": 1552957714837,
            "parentDataId": "f242594ba68f4127af1a30edaf142cd8",
            "index": 1073741823,
            "dataId": "647dcdea1f09443eb2d9c19e9f614bab",
            "type": 100,
            "name": "47216-StaffGroup",
            "namePinyin": "47216-StaffGroup",
            "namePinyinForSearch": "4sg,47216-sg,47216-staffgroup",
            "mobile": null,
            "email": null,
            "title": null,
            "gender": null,
            "number": null
            }]
      }
    },
    mounted(){
    },
    methods: {
    }
  };
</script>
```
### 树 assignProps 的使用
例如：
```
        formatTreeNode(item) {
            let userId = auth.getUser().personal.staffId;
            let newAttr = {};
            if(/([a-z]\.)+/.test(item.name)){
                newAttr.name = this.$t(item.name);
            }
            newAttr.icon = item.type;
            if (this.isEdit) {
                    if (item.id === this.organizer.id) { // 编辑模式 载入组织者id
                        newAttr.checked = true;
                        newAttr.chkDisabled = true;
                        newAttr.disabled = true;
                        newAttr.delete = true;
                    }
                } else {
                    if (item.id === userId) { //预约模式载入 用户id
                        newAttr.checked = true;
                        newAttr.chkDisabled = true;
                        newAttr.disabled = true;
                        newAttr.delete = true;
                    }
                }
            return newAttr;
        }
```
### 树 Attributes

| 参数                   | 说明                                       | 类型                          | 可选值  |默认值 |
| :--                    | :--                                        | :--                          | :-- | :-- |
| ------- | ---------------------------------------- | -------------- | ---- | ----- |
| isShowSearch          | 是否显示搜索                             | Boolean                      | —    | —     |true|
| isShowTool            | 是否显示操作栏,支持上下移动              | Boolean                      | —    | —     |false |
| title                 | 树标题                              | String                      | —    | —     | - |
| customClass                  | 自定义样式                               | String     | —    | —     |
| row-render        | 树节点的内容区的渲染 Function                      | Function(node, treeOptions)        | —    | —     |
| search-render     | 搜索的内容区的渲染 Function                 | Function (data,index) 内容最外层节点需要带上 data-index 属性                   | —    | - |
| load-nodes      | 异步加载节点  Function                      | Function (parentNode, next)            | —    | —     |
| props    |  配置属性，需要多选请配置checkedBox属性                            | Object                     | autoOpen:false,noDataClass:'infinite-tree-no-data',noDataText:'No data',selectable:true ,checkedBox:false   |  | {autoOpen:false,checkedBox:false}
| custom  | 自定义数据节点读取的属性 | Object                     | —    |  {id: 'id',parentId: 'parentId',type:'type',label:"name"}  |
| loadOnDemand    | 配合异步加载使用，显示异步loading效果。默认都不显示。                   | Function                     | —    |  function(v) {return false;} |
| filterNodeKey | 搜索树需要匹配的对象内容                        | array                       | —    | ['name']     |
|remoteMethod         | 搜索树使用远程方法                                 | Function                     | —    | - |
| check-strictly        | 在显示复选框的情况下，是否严格的遵循父子互相关联的做法，默认为 true   | boolean                     | —    | true |
| limit-check        | 在显示复选框的情况下，是否限制勾选，默认是无限制   | Function(node,checked) 回调当前变化的节点，以及是否勾选                     | —    | -- |
| move-able        | 在显示操作栏情况下，支持自定义是否可操作   | Function(node,value=true) {return value} 支持改写是否可操作的判断逻辑，回调当前目标节点以及原来判断逻辑获得的值                   | —    | -- |
| muldepart        | 存在同一节点属于不同父节点(依然需要有唯一标识id)父子关系可以通过配置custom读取不同属性构建  | boolean                     | —    | false |
| assignProps        | 合并需要的属性到对象里面，方法会回调遍历过程中每个对象 | Function                     | —    | {} |

### 方法
`Tree` 拥有如下方法：
| 方法名             | 说明                                         | 参数                                       |
| ---------------   | -------------------------------------------- | ---------------------------------------- |
| loadTree          | 初始加载数据                                | (data,defaultChecked：id数组) |默认勾选通过这个方法在初始阶段做掉
| updateTree | 更新整棵树 |(data,defaultChecked) |
| openNode | 展开某个节点 |节点ID |
| checkNode | 勾选某个节点        | (id,isChecked)                       |
| selectNode  | 选择某个节点 | (id) |
| updateNode  | 更新节点数据|(id,data) |
| getChecked      | 获取勾选IDS | -- |
| scrollTop | 滚动到目标位置 | （px）Number |
| removeNode | 删除节点 | (id) |
| appendNode | 插入节点 | （node:目标,newNode：新增）|  
| setCheckedKeys | 批量勾选 | （ids:树的id数组,value：是否勾选默认为true）|  

### Events
| 事件名称           | 说明             | 回调参数                                     |
| -------------- | -------------- | ---------------------------------------- |
| checkNode   | 节点选中状态发生变化时的回调 | 共两个参数，依次为：当前节点被勾选的ids，当前节点的 Node 对象 |
| current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象          |
| toggle-node    | 节点被展开,关闭时触发的事件    | 节点对应的 Node |





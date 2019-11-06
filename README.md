# tshello

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
如果没有装element依赖，执行
npm run install:element
```
npm run start:pc
npm run start:mobile 
```

### Compiles and minifies for production
```
npm run build:xxx
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```
### npm  
npm install uglify-js -g  
npm install supervisor -g 

### installTree
如果项目有用到树组件，npm run install:tree ,安装依赖包

### 工具库  
[lodash](https://www.lodashjs.com/)    
[date-fns](https://date-fns.org/)   

### 编程风格    
[fontEnd-blog](https://nibilin33.github.io/frontend-blog/)

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
```
module.exports = {  
 // 基本路径  
 baseUrl: '/',  
 // 输出文件目录  
 outputDir: 'dist',  
 // eslint-loader 是否在保存的时候检查  
 lintOnSave: true,  
 // use the full build with in-browser compiler?   
 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only   
 compiler: false,  
 // webpack配置  
 // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md  
 chainWebpack: () => {},  
 configureWebpack: () => {},  
 // vue-loader 配置项  
 // https://vue-loader.vuejs.org/en/options.html  
 vueLoader: {},  
 // 生产环境是否生成 sourceMap 文件  
 productionSourceMap: true,  
 // css相关配置  
 css: {   
  // 是否使用css分离插件 ExtractTextPlugin  
  extract: true,  
  // 开启 CSS source maps?  
  sourceMap: false,  
  // css预设器配置项   
  loaderOptions: {},   
  // 启用 CSS modules for all css / pre-processor files.   
  modules: false  
 },   
 // use thread-loader for babel & TS in production build   
 // enabled by default if the machine has more than 1 cores  
 parallel: require('os').cpus().length > 1,  
 // 是否启用dll
 // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode   
 dll: false,   
 // PWA 插件相关配置 
 // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa 
 pwa: {},   
 // webpack-dev-server 相关配置  
 devServer: {  
  open: process.platform === 'darwin', 
  host: '0.0.0.0',   
  port: 8080,  
  https: false,   
  hotOnly: false, 
  proxy: null, // 设置代理 
  before: app => {}  
 },   
 // 第三方插件配置   
 pluginOptions: { 
  // ... 
 } 
}  
```
## 运行多态的想法  
运行时本身已经确定入口和路由以及一些配置差异，    
这边采取运行时替换生成，后续改成模板的方式，替换占位符号。  
**router 和入口 main 是运行时覆盖生成，配置都在entry里面做修改**
**api行为基本一致，只是loading效果和提示效果不一致，做完拆分后同样可以做替换处理**  
**国际化config文件也是通过遍历目录生成，只需增加目录运行后即可更新**    

## 目录结构说明
>---- examples  
>---- auto-test   自动化测试脚本     
>---- entry  项目启动入口脚本配置  
>---- public  
>---- src  
>>---- api  
>>---- assets  
>>---- components  
>>---- mixins  通用的逻辑的封装     
>>---- i18n  
>>---- channel  与终端交互的通道API         
>>---- router  
>>---- store  
>>---- utils  
>>---- views 

例如
写法二：  
|-router  
 -- notice  
    -- pc.ts    
    -- mobile.ts    
 -- index.ts   (该文件运行时会根据配置覆盖)
例如公告模块：  
|-notice
 -- __tests__  单元自测目录   
 -- adapters  数据处理  
 -- entity   实体对象，封装业务流程 
 -- interface 定义的数据结构  
 -- platform  不同平台（pc,mobile,小程序等）    
    -- pc   
    -- mobile  
    -- weapp   
 -- webpack.rule.js  支持单独打包该模块   


 ## 可能遇到的问题  
安装饿了么的主题工具npm i element-theme -g  
执行et 时候报错
et : 无法加载文件 C:\Program Files\nodejs\et.ps1，因为在此系统上禁止运行脚本。  
有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
所在位置 行:1 字符: 1   
解决：  
get-executionpolicy 会得到 Restricted  
修改它  
Set-ExecutionPolicy -Scope CurrentUser  
remotesigned  
## 样式引用说明  
下面是所有样式都引入  
```
<style src="@yealink-ui-css/index.css">
</style>
```
因为ume模块直接比较独立，所以在各自模块需要的模块引入，比如：  
PC端
```
<style src="@yealink-ui-css/button.css">
</style>
```  
移动端  
``` 
<style src="@vant-theme/button/index.less" lang="less">
</style>
```
iconfont 资源只有多个模块都有用到的会放到公共目录   
其余的在各自模块建立font目录，在app.vue中引入   
## css Module   
[css module](https://github.com/css-modules/css-modules)  
开启了css module 配置，可以这么使用  
``` 
<style lang="scss" module scoped>
.meeting-layout{
  font-size:24px;
  color: red;
}
</style>
script 中   
this.$style['meeting-layout']   
template 中   
$style['meeting-layout']    
```
## 组件库使用说明  
采用外部lib的方式，直接使用打包后的。  
后续会增加脚本完善。       
根据项目需要做修改，不去影响公共的。 
不同项目需求不同,这样让使用更加灵活一点。     
vue.config.js 配置
```
  chainWebpack:(config)=> {
    config.resolve.alias
        .set('@yealink-ui', resolve('ui-lib/element-dev/lib/element-ui.common.js'))
        .set('@yealink-ui-css',resolve('theme'))
        .set('@vant-ui',resolve('ui-lib/vant-dev/lib/vant.min.js'))
        .set('@vant-theme',resolve('ui-lib/vant-dev/lib'));
  }
``` 
使用和之前一模一样,只是修改import路径。
例如：  
```
import {Message} from '@yealink-ui';
```
内嵌web模块直接相对独立，就不在APP里面一次引入所有需要。     
各自模块需要什么组件，开一个app页去引入资源，子路由的页面就都用了。     


## element-UI 打包修改点
1.build/config 
```
exports.alias = {
  '@element-ui': path.resolve(__dirname, '../')
};
```
2.全局替换 import from 'element-ui' 为 from '@element-ui'   

## 用户行为上报+问题追踪    
Log 只记录行为（为用户行为上报预留）   
trace 记录网站性能情况以及可以判断错误的依据。         
```
export class Notice {
    @Log(
        {
            module: 'Notice',
            eventName: 'findById',
            eventProperty: '定位ID',
        },
    )
    findById() {
    }
}
```

## 单元测试说明  
__test__ 目录置放在模块内   
1.测试用例要覆盖常用的输入组合、边界条件和异常。  
2.测试代码要非常简单，如果测试代码太复杂，那么测试代码本身就可能有bug。   
### 为什么要做单元测试？
1.便于后期重构。单元测试可以为代码的重构提供保障，只要重构代码之后单元测试全部运行通过，那么在很大程度上表示这次重构没有引入新的BUG，当然这是建立在完整、有效的单元测试覆盖率的基础上。   
2.优化设计。编写单元测试将使用户从调用者的角度观察、思考，特别是使用TDD驱动开发的开发方式，会让使用者把程序设计成易于调用和可测试，并且解除软件中的耦合。   
3.文档记录。单元测试就是一种无价的文档，它是展示函数或类如何使用的最佳文档，这份文档是可编译、可运行的、并且它保持最新，永远与代码同步。
4.具有回归性。    

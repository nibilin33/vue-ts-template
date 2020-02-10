## 端到端测试
[webdriverio](https://github.com/webdriverio/webdriverio) 
npm init -y     
npm i --save-dev @wdio/cli      
./node_modules/.bin/wdio config -y
常用命令    
./node_modules/.bin/wdio --help 

## 可能遇到的问题
>MSBUILD : error MSB3428: 未能加载 Visual C++ 组件“VCBuild.exe”。要解决此问题，1) 安装 .NET Framework 2.0 SDK；2) 安装 Microsoft Visual Studio 2005；或 3) 如果将该组件安装到了其他位置，请将其位置添加到
系统路径中。 [J:\gitlab\ume_ts_refactoring\webdriv
er-test\node_modules\fibers\build\binding.sln]

解决：
1、npm install --global --production windows-build-tools 找到目录，执行安装
2.npm install -g node-gyp       
node-gyp configure   


>webdriver: unknown error: unknown error: cannot find Chrome binary      
chrome 不在C盘，重装Chrome (T_T)   

## 方便写用例的工具
Selenium IDE    
[FireFox 插件](https://addons.mozilla.org/en-US/firefox/addon/selenium-ide/)        
[Chrome 插件](https://github.com/nibilin33/frontend-blog/raw/master/press/guide/crx/chrome_selenium.crx)

## Xpath 学习
[xpath](https://devhints.io/xpath)



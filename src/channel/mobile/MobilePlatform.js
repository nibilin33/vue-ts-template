export default class MobilePlatform {
    constructor() {

    }

    /**
   * 发送给平台基类
   * @param data
   */
    setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            const result = callback(WebViewJavascriptBridge);
            return result;
        }
        if (window.WVJBCallbacks) {
            const result = window.WVJBCallbacks.push(callback);
            return result;
        }
        window.WVJBCallbacks = [callback];
        const WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(() => {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }

    /**
   * WEB向OC发起请求
   * @param name 方法接口名称
   * @param params 方法要传递的参数
   * @returns {Promise}
   */
    handlerWebViewJavascriptBridge(name, params) {
    // alert(`${name} : ${JSON.stringify(params||{})}`);
        const timeout = null;
        return new Promise((resolve, reject) => {
            function handler(bridge) {
                bridge.callHandler(name, JSON.stringify(params || {}), (response) => {
                    clearTimeout(timeout);
                    try {
                        // alert(`获取到OC传来的${name}响应内容: ${response} ,类型：${typeof response}`);
                        const json = JSON.parse(response);
                        resolve(json);
                    } catch (e) {
                        reject({ msg: '获取失败' });
                    }
                });
            }

            this.setupWebViewJavascriptBridge(handler);
        });
    }

    registerWebViewJavascriptBridge(name, fun) {
        function handler(bridge) {
            bridge.registerHandler(name, fun);
        }
        this.setupWebViewJavascriptBridge(handler);
    }
}

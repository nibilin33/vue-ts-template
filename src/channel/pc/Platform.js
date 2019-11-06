/**
 * 与平台通信的基类
 */

import './qwebchannel';

export default class Platform {
    static TIME_OUT = 8000;

    static platformMaps = {};

    static sno = 0;

    constructor() {
        window.receiveMessageFromPlatformFunc = Platform.receiveMessageFromPlatform;
        window.initData = Platform.initData;
    }

    /**
     * 初始化方法
     */
    static initData() {


    }

    static registerPlatform(key, callBack) {
        Platform.platformMaps[key] = callBack;
    }

    /**
     * 向平台接收消息，暂时私有方法
     * @param data
     */
    static receiveMessageFromPlatform(data) {
        let { sno, notify, param } = JSON.parse(data);
        console.log(param, notify, sno, data);
        if (sno) {
            Platform._dispatchMessage(sno, param);
            Platform._deletePlatform(sno);
            return;
        }
        if (typeof notify === 'undefined') {
            notify = param.notify;
        }
        if (notify) {
            Platform._dispatchMessage(notify, param);
        }
    }

    setReTimeOut(value) {
        Platform.TIME_OUT = value;
    }

    /**
     * 发送给平台
     * @param data
     * @returns {Promise}
     */
    sendMessageToPlatform(data) {
        const promise = new Promise((resolve, reject) => {
            let timeout = null;
            const responseFunc = (data) => {
                // alert(JSON.stringify(data))
                clearTimeout(timeout);
                // console.log(data)
                resolve(data);
            };
            const sno = Platform._getSno();
            // alert(sno)
            Platform._addPlatform(sno, responseFunc);
            const str = JSON.stringify(Object.assign(data, { sno }));
            // alert(str)
            window.sendMessageToPlatformFunc(str);
            // window.sendMessageToPlatformFunc({ sno });

            // todo test
            /*    setTimeout(_ => {
                   window.receiveMessageFromPlatformFunc(JSON.stringify({sno:sno, notify:0, param:{  code: 'b3c95398a1eb45e4b7006a2f96b1ea8c'}}))
                 window.receiveMessageFromPlatformFunc(JSON.stringify({
                       sno: sno,
                       param: {code: 0, sessionId: '123456789'}
                   }))
               }, 1000); */
            // todo test

            timeout = setTimeout(() => {
                Platform._deletePlatform(sno);
                clearTimeout(timeout);
                console.log('timeout');
                reject({ result: false });
            }, Platform.TIME_OUT);
        });
        // alert()
        return promise;
    }


    static _getSno() {
        return ++Platform.sno;
    }

    /**
     * 注册方法
     * @param key
     * @param callBack
     * @private
     */
    static _addPlatform(key, callBack) {
        Platform.platformMaps[key] = callBack;
    }

    /**
     * 删除没用的事件
     * @param key
     * @private
     */
    static _deletePlatform(key) {
        if (Platform.platformMaps[key]) {
            delete Platform.platformMaps[key];
        }
    }

    /**
     * 处理回调方法，广播事件
     * @param key
     * @param params
     * @private
     */
    static _dispatchMessage(key, params) {
        if (Platform.platformMaps[key]) {
            Platform.platformMaps[key](params);
        } else {
            console.log(key);
        }
    }
}

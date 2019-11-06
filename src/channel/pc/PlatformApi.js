import { defaultsDeep, get, isEmpty } from 'lodash';
import Platform from './Platform';

const typeMach = {
    image: 'browse_original_image',
    file: 'down_file',
};
class PlatformApi extends Platform {
    static clientId = null;

    constructor(applicationReq, loginReq) {
        super();
        this.applicationReq = applicationReq;
        this.loginReq = loginReq;
        this.setReTimeOut(8000);
    }

    setRequestTimeOut(value) {
        this.setReTimeOut(value);
    }

    /**
     * 初始化，获取code
     * @returns {Promise}
     */
    initialize() {
        return new Promise(async (resolve, reject) => {
            console.log('initialize---------');
            const res = await this.applicationReq();
            console.log(res, '-------------------');
            if (res.ret >= 0) {
                PlatformApi.clientId = get(res, 'data.application.clientId', null) || get(res, 'data.clientId', null);
                if (PlatformApi.clientId) {
                    try {
                        const result = await this.getCode();
                        console.log(result, '----fuck');
                        if (result) {
                            resolve(result.code);
                        }
                    } catch (error) {
                        console.log(error);
                        reject(false);
                    }
                }
            }
            reject(false);
        });
    }

    /**
     * 登陆
     * @param code
     * @returns {Promise}
     */
    async login(code) {
        return new Promise(async (resolve, reject) => {
            const _params = {};
            if (code) {
                _params.code = code;
            } else {
                try {
                    _params.code = await this.initialize();
                } catch (error) {
                    console.log(error);
                    reject({ result: false });
                }
            }
            console.log(_params, '------');
            this.loginReq(_params).then((result) => {
                console.log('login.result', result);
                const token = get(result, 'data');
                const personal = get(result, 'data.personal');
                if (token) {
                    resolve(token);
                } else if (personal) {
                    resolve(result);
                } else {
                    reject(result);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    //  {
    //     sno: 1,
    //         type:“handle_open_app_sdk”,
    //     param: {
    //         "uri":"xxx"
    //         "client":"XXX"
    //         "width":"800"
    //         "height":"600"
    //         "protocol": "http",
    //             "type": "internal",
    //                 "name": {
    //             "en": "Bulletin",
    //                 "cn": "公告"
    //         },
    //     }
    // }
    async openPanel(params) {
        const _params = {
            type: 'handle_open_app_sdk',
            param: Object.assign({}, { width: 800, height: 600 }, params),
        };
        console.log('openpenl');
        return this.sendMessageToPlatform(_params);
    }

    async getGroupMembersById(id) {
        const _params = {
            type: 'get_group_members',
            param: {
                groupId: id,
            },
        };
        return this.sendMessageToPlatform(_params);
    }

    /**
     * web向native发送创建讨论组的请求消息 直接打开对话框
     * @param groupName
     * @param userIdList 不要传空数组
     * @param sudm
     */
    async createGroup({ groupName, userIdList }) {
        const _params = {
            type: 'handle_create_disscusion_group_sdk',
            param: { groupName, userIdList },
        };
        // console.log(_params)
        // alert(_params.param.groupName)
        // alert(JSON.stringify(_params));
        // const {code, sessionId} = await
        // const is_group = userIdList.length > 1;
        // if (code === 0) {
        //     const _params_im_session = {
        //         type: is_group ? 'handle_open_disscusion_group_sdk' : 'handle_open_im_session_sdk',
        //         param: {
        //             sessionType: is_group ? 'groupchat' : 'chat',
        //             sessionId
        //         }
        //     };
        //     this.sendMessageToPlatform(_params_im_session);
        // } else {
        //     return null;
        // }
        return this.sendMessageToPlatform(_params);
    }

    openGroup(sessionId) {
        const _params_im_session = {
            type: 'handle_open_im_session_sdk',
            //  'handle_open_disscusion_group_sdk',
            param: {
                sessionType: 'groupchat',
                sessionId,
            },
        };
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.sendMessageToPlatform(_params_im_session);
                resolve(res);
            } finally {
                resolve(false);
            }
        });
    }


    /**
     * 创建单人会话
     * @param groupName
     * @param userIdList
     * @returns {Promise.<void>}
     */
    async createSession(sessionId) {
        return this.sendMessageToPlatform({
            type: 'handle_open_im_session_sdk',
            param: {
                sessionType: 'chat',
                sessionId,
            },
        });
    }

    /**
     * web向native发送获取授权码的请求消息:
     */
    getCode() {
        const _params = {
            type: 'handle_get_token_sdk',
            param: {
                clientId: PlatformApi.clientId,
            },
        };
        console.log('handle_get_token_sdk', PlatformApi.clientId);
        return this.sendMessageToPlatform(_params);
    }

    closeWindow() {
        const _params = {
            type: 'handle_close_window_sdk',
            param: {},
        };
        this.sendMessageToPlatform(_params);
    }

    downloadFileTyle(type) {
        // const type
        const _params = {
            type: 'handle_set_browser_down_type_sdk',
            param: {
                type: isEmpty(typeMach[type]) ? 'file' : typeMach[type],
            },
        };
        return this.sendMessageToPlatform(_params);
    }

    sendIM({ sessionId, text }) {
        const _params = {
            type: 'handle_send_im_sdk',
            param: {
                sessionId,
                text,
            },
        };
        return this.sendMessageToPlatform(_params);
    }

    openWeb(params) {
        const _params = {
            type: 'handle_open_url_sdk',
            param: params,
        };
        return this.sendMessageToPlatform(_params);
    }

    openPath(params) {
        const _params = {
            type: 'handle_open_path_sdk',
            param: params,
        };
        console.log(_params);
        return this.sendMessageToPlatform(_params);
    }

    consoleLog(str) {
        const _params = {
            type: 'handle_output_log_sdk',
            param: {
                strLog: str,
            },
        };
        return this.sendMessageToPlatform(_params);
    }
}


export default PlatformApi;

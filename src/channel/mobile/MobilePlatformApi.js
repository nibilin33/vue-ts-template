/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 10:32:02
 * @LastEditTime: 2019-08-26 18:06:38
 * @LastEditors: Please set LastEditors
 */
import MobilePlatform from './MobilePlatform';
import { test_code_login } from '../../api/notice/bulletin';

class MobilePlatformApi extends MobilePlatform {
  static voteClientId = 'yealink-vote';

  static noticeClientId = 'yealink-bulletin';

  static extensionClientId ='web-extension';

  static forwardClientId = 'yealink-pbx';

  static imessageClientId = 'yealink-smsgateway';

  /**
   * 初始化，获取code
   * @returns {Promise}
   */
  getCode(clientId, code) {
      // todo test
      if (process.env.NODE_ENV === 'development') {
          return new Promise(async (resolve, reject) => {
              try {
                  // yl1347@10.86.6.125.xip.io@ZUiwhW 1346@ZUiwhW
                  const res = await test_code_login({
                      userId: 'yl1346@ZUiwhW',
                      // userId: 'yl2258@ZUiwhW',
                      clientId,
                  });
                  resolve({ code: res });
              } catch (er) {
                  reject(er);
              }
          });
      }
      if (code) {
          return new Promise((resolve) => {
              resolve({ code });
          });
      }
      // todo test end
      return this.handlerWebViewJavascriptBridge('handle_get_token_sdk', { clientId });
  }

  // 打开浏览器
  openUrl(params) {
      return this.handlerWebViewJavascriptBridge('handle_open_url', params);
  }

  closeLoading() {
      return this.handlerWebViewJavascriptBridge('handle_load_finish');
  }

  /**
   * 创建讨论组
   * @param groupName  讨论组名称
   * @param userIdList 用户列表
   * @param callback 回调方法
   */
  createGroup(params) {
      return this.handlerWebViewJavascriptBridge('handle_create_disscusion_group_sdk', params);
  }

  /**
   * 打开讨论组
   * @param params
   * @returns {Promise}
   */
  openGroup(params) {
      return this.handlerWebViewJavascriptBridge('handle_receive_sessionID_sdk', params);
  }

  /**
   * text 提示内容,type
   * @param params
   * @returns {Promise}
   */
  toast(params) {
      return this.handlerWebViewJavascriptBridge('handle_open_toast', params);
  }

  getFileStatus(params) {
      return this.handlerWebViewJavascriptBridge('handle_get_file_status', params);
  }

  picturePreview(params) {
      return this.handlerWebViewJavascriptBridge('handle_get_img_preview', params);
  }

  /**
   * 获取文件预览
   * @param url
   * @param name
   * @param callback
   */
  getFilePreview(params) {
      return this.handlerWebViewJavascriptBridge('handle_get_file_preview', params);
  }

  /**
   * 关闭页面
   * @param callback
   */
  closePage() {
      return this.handlerWebViewJavascriptBridge('handle_close_page');
  }

  /**
   * 查看用户详情
   * @returns {Promise}
   */
  getUserInfoSdk(params) {
      return this.handlerWebViewJavascriptBridge('handle_get_user_info_sdk', params);
  }

  /**
   * 查看用户详情
   * @returns {Promise}
   */
  getLanguageSdk() {
      return this.handlerWebViewJavascriptBridge('handle_get_language_sdk', {});
  }


  registerListUpdate(fun) {
      return this.registerWebViewJavascriptBridge('Test_Native_Callback', fun);
  }

  /**
   * @description: 是否显示导航栏
   * @param isShow:Boolean
   * @return:
   */
  hasTitlebar(isShow) {
      return this.handlerWebViewJavascriptBridge('handle_has_titlebar', { isShow });
  }

  /**
 *  web向native请求打开选择成员(工作台集成第三方)
 * @param params
 */
  openSelectMembers(params) {
      return this.handlerWebViewJavascriptBridge('handle_select_members', params);
  }

  /**
 *  web向native请求打开查看成员(工作台集成第三方)
 * @param params
 */
  openListMembers(params) {
      return this.handlerWebViewJavascriptBridge('handle_list_members', params);
  }
}

export default MobilePlatformApi;

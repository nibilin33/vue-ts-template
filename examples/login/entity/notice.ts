import { login as apiLogin } from '@/api/notice';
import { Log } from '@/utils/log';

export default class NoticeAPI {
  @Log({ eventName: 'notice-login', eventProperty: 'yo' })
  login(code:string) {
    console.log(code, 'notice');
    apiLogin();
  }
}

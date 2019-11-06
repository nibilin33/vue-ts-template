import { Message } from '@yealink-ui';
import '@yealink-ui-css/message.css';

interface tipOptions {
  message?: string,
  type?: string,
  iconClass?: string
}

export default class Tip {
    static showTip(options: tipOptions = { type: 'error' }) {
        Message(options);
    }

    static closeTip() {
        Message.closeAll();
    }
}

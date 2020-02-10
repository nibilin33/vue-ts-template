import { Toast } from '@vant-ui';

interface tipOptions {
  message?: string,
  type?: string,
  iconClass?: string
}

export default class Tip {
    static showTip(options: tipOptions = { type: 'error' }) {
        Toast(options);
    }

    static closeTip() {
        Toast.clear();
    }
}

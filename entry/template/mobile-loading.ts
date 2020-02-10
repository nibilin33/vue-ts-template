import { Toast } from '@vant-ui';

interface loadOptions {
  target?: [object, string],
  text: string,
  customClass?: string,
  background?: string
}

export default class CustomLoading {
  static loadingInstance : any

  static showLoading(options: loadOptions = { text: 'loading' }) {
      Toast.loading({ message: options.text, forbidClick: true, duration: 0 });
  }

  static closeLoading() {
      setTimeout(() => {
          Toast.clear();
      }, 100);
  }
}

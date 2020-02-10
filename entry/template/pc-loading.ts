import { Loading } from '@yealink-ui';
import '@yealink-ui-css/loading.css';

interface loadOptions {
  target?: [object, string],
  text: string,
  customClass?: string,
  background?: string
}

export default class CustomLoading {
  static loadingInstance : any

  static showLoading(options: loadOptions = { text: 'loading' }) {
      this.loadingInstance = Loading.service(options);
  }

  static closeLoading() {
      setTimeout(() => {
          this.loadingInstance && this.loadingInstance.close();
      }, 100);
  }
}

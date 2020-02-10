interface loadOptions {
  target?: [object, string],
  text: string,
  customClass?: string,
  background?: string
}

export default class CustomLoading {
  static loadingInstance : any

  static showLoading(options: loadOptions = { text: 'loading' }) {
    window.parent.postMessage({
        event: 'loading',
        operate: 'open',
        data: options,
    },'*');
  }

  static closeLoading() {
      setTimeout(() => {
        window.parent.postMessage({
            event: 'loading',
            operate: 'close',
        },'*');
      }, 100);
  }
}

interface tipOptions {
  message?: string,
  type?: string,
  iconClass?: string
}

export default class Tip {
    static showTip(options: tipOptions = { type: 'error' }) {
        window.parent.postMessage({
            event: 'tip',
            operate: 'open',
            data: options,
        },'*');
    }

    static closeTip() {
        window.parent.postMessage({
            event: 'tip',
            operate: 'close',
        }, '*');
    }
}

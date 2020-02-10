import Brower from '@/utils/brower';

export enum themeMap{
    default='-00BE93',
    dark= '',
}
const hex2rgba = (hex:any, alpha = 1) => {
    console.log(hex);
    hex = hex || '00BE93';
    const [r, g, b] = hex.match(/\w\w/g).map((x:any) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

export default class Theme {
    static themeUrls = window.themeURL || []

    static createThemeLinks(fileName:string) {
        const domHead:any = document.getElementsByTagName('HEAD').item(0);
        const href = this.themeUrls.find((it:string) => this.urlRegTest(it, fileName));
        if (this.themeUrls) {
            const style = document.createElement('link');
            Object.assign(style, {
                href,
                rel: 'stylesheet',
                type: 'text/css',
            });
            domHead.appendChild(style);
        }
    }

    static urlRegTest(url:string, name:string) {
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        const reg = new RegExp(`^${name}(\\-\\w+)*(\\.\\w+)*\\.css$`);
        return reg.test(fileName);
    }

    static getFileList(cssList:Array<string>, name:string) {
        const matchFileList:Array<any> = [];
        cssList.forEach((url) => {
            if (this.urlRegTest(url, name)) {
                matchFileList.push(url);
            }
        });
        return matchFileList;
    }

    static getStyleUrlList() {
        const domHead:any = document.getElementsByTagName('HEAD').item(0);
        const styleList = Array.from(domHead.querySelectorAll('link[rel=\'stylesheet\']'));
        const urlList:Array<any> = [];
        styleList.forEach((item:any) => {
            urlList.push(item.getAttribute('href'));
        });
        return urlList;
    }

    static appendDarkMask(theme:string) {
        const mask = document.getElementById('theme-dark-mark');
        if (mask) {
            document.body.removeChild(mask);
        }
        if (theme !== 'dark') {
            return;
        }
        const brightness = 0.25;
        const div = document.createElement('div');
        div.setAttribute('style', 'position:fixed;top:0;left:0;bottom:0;outline:100vw solid;z-index:99999;');
        div.setAttribute('id', 'theme-dark-mark');
        document.body.appendChild(div);
        div.style.outlineColor = `rgba(0,0,0,${brightness})`;
    }

    static setTheme(params:any) {
        const themeType = params.theme || 'default';
        window.umeTheme = themeType;
        const hightlight = params.color ? `-${params.color.replace('#', '')}` : '';
        const color = hightlight.toUpperCase() || (themeMap as any)[themeType];
        const fileName = Brower.isMobile() ? `mb-theme${color}` : `theme${color}`;
        const urlList:Array<any> = this.getStyleUrlList();
        this.appendDarkMask(themeType);
        if (urlList.indexOf(fileName) > -1) {
            return;
        }
        // todo: 其他颜色变量对应主题值计算
        const root = document.documentElement;
        const light = hex2rgba(params.color, 0.3);
        const active = hex2rgba(params.color, 0.2);
        const select = hex2rgba(params.color, 0.4);
        root.style.setProperty('--color-primary', color.replace('-', '#'));
        root.style.setProperty('--meeting-active', active);
        root.style.setProperty('--meeting-room-hover', light);
        root.style.setProperty('--meeting-room-select', select);
        const themeList:Array<any> = this.getFileList(urlList, fileName);
        themeList.forEach((el) => {
            if (this.themeUrls.indexOf(el) >= 0) {
                const item:any = document.querySelectorAll(`link[href="${el}"]`)[0];
                item.parentNode.removeChild(item);
            }
        });
        this.createThemeLinks(fileName);
        /*eslint-disable */
        if (process.env.NODE_ENV !== 'production') {
            if(Brower.isMobile()) {
                require('../assets/themes/mb-theme-00BE93.css');
            } else {
                require('../assets/themes/theme-00BE93.css');
            }
        }
        /* eslint-enable */
    }
}

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {
    getLanguage,
} from '@/utils/lang';

import messages from './config.js';
Vue.use(VueI18n);

const defaultLocale = getLanguage();

localStorage.setItem('LANGUAGE', defaultLocale);

//@ts-ignore
export const i18n = new VueI18n({
    locale: defaultLocale,
    messages,
});

export const $t = (key:string, args?: any) => i18n.t(key, args);

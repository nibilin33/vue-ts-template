import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {
    getLanguage,
} from '@/utils/lang';
// @ts-ignore
import messages from './config.json';

Vue.use(VueI18n);


const defaultLocale = getLanguage();

localStorage.setItem('LANGUAGE', defaultLocale);

export const i18n = new VueI18n({
    locale: defaultLocale,
    messages,
});

export const $t = (key:string, args: any) => i18n.t(key, args);

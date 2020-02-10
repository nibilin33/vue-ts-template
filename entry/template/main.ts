
// @ts-nocheck
import "@babel/polyfill";
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './utils/trace';
import './utils/error';
import { i18n } from '@/i18n';
Vue.config.productionTip = false;
Vue.config.silent = true;
new Vue({
router,
i18n,
render: h => h(App),
}).$mount('#app');
    

const resolve = require('./utils');
const filePath = resolve('../');

module.exports= {
    main:`
    // @ts-nocheck
    import Vue from 'vue';
    import App from './App.vue';
    import router from './router';
    import './utils/trace';
    import { i18n } from '@/i18n';
    Vue.config.productionTip = false;
    new Vue({
    router,
    i18n,
    render: h => h(App),
    }).$mount('#app');
    `,
    router:
    `
    // @ts-nocheck
    import Vue from 'vue';
    import Router from 'vue-router';
    const Notice = require('./notice/pc').default;
    const Meeting = require('./meeting/pc').default;
    const Vote = require('./vote/pc').default;
    const Pbx = require('./pbx/pc').default;
    const IMessage = require('./imessage/pc').default;
    const Question = require('./questionnaire/pc').default;
    const Extensions = require('./extension-entry/pc').default;
    const ErrorPage = require('./error/pc').default;
    Vue.use(Router);
    export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
    ...Notice,
    ...Meeting,
    ...Vote,
    ...Pbx,
    ...IMessage,
    ...Question,
    ...Extensions,
    ...ErrorPage,
    ],
    });
    `,
    routerPath:`${filePath}/src/router/index.ts`,
    mainPath:`${filePath}/src/main.ts`,
    i18nDir:`${filePath}/src/i18n/lang`,
    i18nPath:`${filePath}/src/i18n/config.json`
}
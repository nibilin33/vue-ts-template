
const resolve = require('./utils');
const filePath = resolve('../');
module.exports= {
    main:`
    // @ts-nocheck
    import Vue from 'vue';
    import App from './App.vue';
    import router from './router';
    import './utils/trace';
    Vue.config.productionTip = false;
    new Vue({
    router,
    render: h => h(App),
    }).$mount('#app');
    `,
    router:
    `
    // @ts-nocheck
    import Vue from 'vue';
    import Router from 'vue-router';
    const Notice = require('./notice/mobile').default;
    const Meeting = require('./meeting/mobile').default;
    const Vote = require('./vote/mobile').default;
    const Pbx = require('./pbx/mobile').default;
    const IMessage = require('./imessage/mobile').default;
    const Question = require('./questionnaire/mobile').default;
    const Extensions = require('./extension-entry/mobile').default;
    const ErrorPage = require('./error/mobile').default;
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
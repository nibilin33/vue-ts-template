/*
 * @Autor: ylhuang
 * @Date: 2019-10-28 13:26:23
 * @LastEditTime : 2019-12-19 17:18:37
 */
const common = require('../modes/common-params');
module.exports= {
    platformApi: 'mobile',
    libs: 
    `
    const Notice = require('./notice/mobile').default;
    const Meeting = require('./meeting/mobile').default;
    const Vote = require('./vote/mobile').default;
    const Pbx = require('./pbx/mobile').default;
    const IMessage = require('./imessage/mobile').default;
    const Question = require('./questionnaire/mobile').default;
    const Extensions = require('./extension-entry/mobile').default;
    const ErrorPage = require('./error/mobile').default;
    `,
    routers: 
    `
    [
        ...Notice,
        ...Meeting,
        ...Vote,
        ...Pbx,
        ...IMessage,
        ...Question,
        ...Extensions,
        ...ErrorPage,
        ]
    `,
    ...common,
    plugin: `
        import 'lib-flexible/flexible';
    `}
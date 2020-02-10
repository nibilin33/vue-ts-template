const common = require('./common-params');
module.exports= {
    platformApi: 'pc',
    libs: 
    `
    const Notice = require('./notice/pc').default;
    const Meeting = require('./meeting/pc').default;
    const Vote = require('./vote/pc').default;
    const Pbx = require('./pbx/pc').default;
    const IMessage = require('./imessage/pc').default;
    const Question = require('./questionnaire/pc').default;
    const Extensions = require('./extension-entry/pc').default;
    const ErrorPage = require('./error/pc').default;
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
}
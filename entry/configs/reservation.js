
const common = require('./common-params');
module.exports= {
    platformApi: 'pc',
    libs: 
    `
    const Meeting = require('./meeting/pc').default;
    `,
    routers: 
    `
        [
        ...Meeting,
        ]
    `,
    ...common,
}
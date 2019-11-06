const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    css: {
        requireModuleExtension: true,
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@yealink-ui', resolve('ui-libs/element-dev/lib/element-ui.common.js'))
            .set('@yealink-ui-css', resolve('theme'))
            .set('@vant-ui', resolve('ui-libs/vant-dev/lib/vant.min.js'))
            .set('@vant-theme', resolve('ui-libs/vant-dev/lib'));
    },
    configureWebpack: {},
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/front': {
                target: 'http://127.0.0.1:3000',
            },
        },
        watchOptions: {
            poll: true,
        },
    },
};

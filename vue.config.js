const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getThemeEntry = require('./entry/format-css');
const getPlugins = require('./entry/plugins');

function resolve(dir) {
    return path.join(__dirname, dir);
}
const entry = getThemeEntry(process.env.MODE);
const excludeFiles = Object.keys(entry);
const plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './public/index.html',
        excludeChunks: excludeFiles,
    }),
];
module.exports = {
    lintOnSave: process.env.NODE_ENV !== 'production',
    css: {
        requireModuleExtension: true,
        extract: true,
        loaderOptions: {
            ...getPlugins(process.env.MODE),
        },
    },
    publicPath: '/ume/',
    outputDir: process.env.VUE_APP_SECRET || 'dist',
    assetsDir: `${process.env.MODE}`,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@yealink-ui', resolve('ui-libs/element-dev/lib/element-ui.common.js'))
            .set('@element-ui', resolve('ui-libs/element-dev'))
            .set('@yealink-ui-css', resolve('theme'))
            .set('@vant-ui', resolve('ui-libs/vant-dev/lib/vant.min.js'))
            .set('@vant-theme', resolve('ui-libs/vant-dev/lib'));
        config.optimization.delete('splitChunks');
    },
    configureWebpack: {
        entry,
        plugins,
        optimization: {
            minimize: process.env.NODE_ENV === 'production',
            minimizer: [new TerserPlugin({
                terserOptions: {
                    warnings: false,
                    compress: {
                        drop_console: true,
                        drop_debugger: false,
                        pure_funcs: ['console.log'],
                    },
                },
            })],
        },
    },
    productionSourceMap: false,
    devServer: {
        hot: false,
        proxy: {
            '/front': {
                target: 'http://0.0.0.0:3000',
                changeOrigin: true,
                secure: false,
            },
            '/*/api/v1': {
                target: 'http://0.0.0.0:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
};

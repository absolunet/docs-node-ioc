const path     = require('path');
const basePath = require('./base-path.config');
const sass     = require('sass');

module.exports = {
    publicPath: basePath,
    outputDir: path.join(__dirname, 'docs'),
    chainWebpack: config => {
        config.module.rule('md')
            .test(/\.md/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true
            });
    },
    css: {
        loaderOptions: {
            sass: {
                implementation: sass
            }
        }
    }
};

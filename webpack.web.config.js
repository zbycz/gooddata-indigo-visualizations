const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const getWebpackConfig = require('./webpack.config');

const pkg = require('./package.json');
const execSync = require('child_process').execSync;

const webpackConfig = getWebpackConfig();
const date = new Date().toString();
const lastCommitSHA = execSync('git log -1 --format="%h"', { encoding: 'utf8' }).replace('\n', '');
const license = `/*!
 * ${pkg.name} - v${pkg.version}
 * ${webpackConfig.copyright}
 * Latest git commit: ${lastCommitSHA}
 * ${date}
 */\n`;

const uglifyOptions = {
    mangle: false,
    compress: {
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        booleans: true,
        unused: false,
        if_return: true,
        join_vars: true,
        warnings: false
    }
};

module.exports = function createWebConfig() {
    const OUTPUT_DIR = path.join(__dirname, '/web/');
    const distWebConfig = _.assign(webpackConfig, {
        output: {
            path: OUTPUT_DIR,
            filename: `[name].${lastCommitSHA}.[hash].js`
        }
    });

    distWebConfig.module.loaders.filter((definition) => {
        return definition.loader.indexOf('!css') !== -1;
    }).forEach((loaderDefinition) => {
        const loader = loaderDefinition.loader.replace('style!', '');

        loaderDefinition.loader = ExtractTextPlugin.extract('style', loader); // eslint-disable-line
    });

    distWebConfig.plugins = distWebConfig.plugins.concat(
        new webpack.optimize.UglifyJsPlugin(uglifyOptions),

        new ExtractTextPlugin(`[name].${lastCommitSHA}.[hash].css`),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            copyright: webpackConfig.copyright,
            template: 'index.webpack.html'
        }),

        new webpack.BannerPlugin(license, { raw: true }),

        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),

        function collectStats() {
            this.plugin('done', (stats) => {
                const filename = path.join(OUTPUT_DIR, 'stats.json');
                require('fs').writeFileSync(filename, JSON.stringify(stats.toJson(), null, '\t'));
            });
        }
    );

    return distWebConfig;
};

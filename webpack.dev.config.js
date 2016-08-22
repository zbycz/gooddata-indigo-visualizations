const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getWebpackConfig = require('./webpack.config');

const webpackConfig = getWebpackConfig();

module.exports = function createDevConfig(config) {
    const devConfig = _.assign(webpackConfig, {
        devtool: 'cheap-inline-source-map',

        output: {
            path: path.join(__dirname, 'dist'),
            // Specify complete path to force
            // chrome/FF load the images
            publicPath: `https://localhost:${config.port}/`,
            filename: '[name].js'
        }
    });

    _.keysIn(devConfig.entry).forEach((key) => {
        const currentValue = devConfig.entry[key];

        devConfig.entry[key] = currentValue.concat(
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client'
        );
    });

    devConfig.module.loaders.forEach((loaderDef) => {
        if (loaderDef.test.toString().indexOf('.js') > 0) {
            /* eslint-disable no-param-reassign */
            loaderDef.loader = `react-hot!${loaderDef.loader}`;
            /* eslint-enable no-param-reassign */
        }
    });

    devConfig.plugins = devConfig.plugins.concat(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            DEBUG: true
        }),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            copyright: webpackConfig.copyright,
            template: 'index.webpack.html'
        })
    );

    return devConfig;
};

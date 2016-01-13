var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var getWebpackConfig = require('./webpack.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function createDevConfig(config) {
    var devConfig = _.assign(getWebpackConfig(), {
        devtool: 'cheap-inline-source-map',

        output: {
            path: path.join(__dirname, 'analyze'),
            // Specify complete path to force
            // chrome/FF load the images
            publicPath: 'https://localhost:' + config.port + '/analyze/',
            filename: '[name].js'
        }
    });

    _.keysIn(devConfig.entry).forEach(function(key) {
        var currentValue = devConfig.entry[key];

        devConfig.entry[key] = currentValue.concat(
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client'
        );
    });

    devConfig.module.loaders.forEach(function(loaderDef) {
        if (loaderDef.test.toString().indexOf('.js') > 0) {
            loaderDef.loader = 'react-hot!' + loaderDef.loader;
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
            title: 'Analyze',
            template: 'index.webpack.html',
            ga: 'UA-3766725-6'
        })
    );

    return devConfig;
};

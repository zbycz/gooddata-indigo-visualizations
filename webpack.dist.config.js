var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var getWebpackConfig = require('./webpack.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var GitSHAPlugin = require('git-sha-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

var uglifyOptions = {
    mangle: true,
    compress: {
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        warnings: false
    }
};

var distConfig = _.assign(getWebpackConfig(), {
    output: {
        path: path.join(__dirname, '/dist/'),
        publicPath: '/',
        filename: '[name].[chunkgitsha].[hash].js'
    }
});

// distConfig.module.loaders.filter(function(definition) {
//     return definition.loader.indexOf('!css') !== -1;
// }).forEach(function(loaderDefinition) {
//     var loader = loaderDefinition.loader.replace('style!', '');
//
//     loaderDefinition.loader = ExtractTextPlugin.extract('style', loader);
// });

distConfig.plugins = distConfig.plugins.concat(
    new GitSHAPlugin({ length: 7 }),
    // new ExtractTextPlugin('[name].[chunkgitsha].[hash].css'),
    new webpack.DefinePlugin({
        'process.env': {
            // This has effect on the react lib size
            NODE_ENV: JSON.stringify('production')
        }
    }),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(uglifyOptions),
    new HtmlWebpackPlugin({
        title: 'Vis Example',
        template: 'index.webpack.html'
    }),

    new CompressionPlugin({
        asset: '{file}.gz',
        algorithm: 'gzip',
        regExp: /\.js$|\.html$|\.css$|\.svg$|\.woff$|\.gif$|\.ttf$|\.eot$/
    }),

    function() {
        this.plugin('done', function(stats) {
            var filename = path.join(__dirname, 'dist', 'stats.json');
            var serializedStats = JSON.stringify(stats.toJson(), null, '\t');

            require('fs').writeFileSync(filename, serializedStats);
        });
    }
);

module.exports = distConfig;

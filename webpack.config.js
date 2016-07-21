/* eslint-disable max-len */
var path = require('path');
var webpack = require('webpack');

module.exports = function getWebpackConfig() {
    const year = new Date().getFullYear();
    return {
        entry: {
            example: ['highcharts', './example/index']
        },

        output: {},

        copyright: `Copyright (C) 2007-${year}, GoodData(R) Corporation. All rights reserved.`,

        module: {

            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel?' + JSON.stringify({ presets: ['es2015', 'react', 'stage-0'] }),
                    include: [
                        path.resolve(__dirname, 'src'),
                        path.resolve(__dirname, 'example'),
                        path.resolve(__dirname, 'test'),
                        path.resolve(__dirname, 'node_modules/js-utils'),
                        path.resolve(__dirname, 'node_modules/goodstrap')
                    ]
                },

                {
                    test: /\.scss$/,
                    loader: 'style!css?sourceMap!autoprefixer!sass?includePaths[]=./node_modules&includePaths[]=./node_modules/foundation-sites/scss'
                },

                {
                    test: /\.css$/,
                    loader: 'style!css?sourcemap'
                },

                // https://msdn.microsoft.com/en-us/library/cc848897(v=vs.85).aspx
                {
                    test: /\.png$/,
                    loader: 'url-loader?limit=32768&mimetype=image/png'
                },

                {
                    test: /\.gif/,
                    loader: 'url-loader?limit=32768&mimetype=image/gif'
                },

                {
                    test: /\.jpg$/,
                    loader: 'file-loader'
                },

                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },

                {
                    test: /\.(eot|woff|ttf|svg)/,
                    loader: 'file-loader'
                },

                {
                    test: require.resolve('react'),
                    loader: 'expose?React'
                }
            ]
        },

        resolve: {
            // Allow to omit extensions when requiring these files
            extensions: ['', '.js', '.jsx', '.scss'],
            modulesDirectories: [
                'node_modules',
                path.join('node_modules/goodstrap/packages')
            ],
            alias: {
                react: path.join(__dirname, 'node_modules/react/')
            }
        },

        plugins: [
            new webpack.NormalModuleReplacementPlugin(/core\/styles\/themes\//, function(requestObject) {
                /* eslint-disable no-param-reassign */
                requestObject.request = requestObject.request.replace(
                    './core/styles/themes/',
                    '../../node_modules/goodstrap/packages/core/styles/themes/'
                );
                /* eslint-enable no-param-reassign */
            }),
            new webpack.ProvidePlugin({
                React: 'react'
            })
        ]
    };
};

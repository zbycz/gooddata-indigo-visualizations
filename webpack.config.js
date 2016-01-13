var path = require('path');
var webpack = require('webpack');

module.exports = function getWebpackConfig() {
    var babelOptions = JSON.stringify({
        stage: 0,
        optional: ['spec.protoToAssign']
    });

    return {
        entry: {
            app: ['./app/app']
        },

        output: {},

        module: {
            noParse: [
                'jquery',
                'react-infinite-list'
            ],

            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel?' + babelOptions,
                    include: /app\/|node_modules\/goodstrap\/|node_modules\/js-utils\//
                },

                {
                    test: /\.jsx$/,
                    loader: 'babel?' + babelOptions,
                    include: /app\/|node_modules\/goodstrap\/|node_modules\/js-utils\//
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
                    test: /\.(eot|woff|ttf|svg)/,
                    loader: 'file-loader'
                },

                {
                    test: /jquery\.js$/,
                    loader: 'expose?jQuery'
                },

                {
                    test: /jquery\.browser\.js$/,
                    loader: 'exports?window.jQBrowser'
                },

                {
                    test: require.resolve('react'),
                    loader: 'expose?React'
                }
            ]
        },

        resolve: {
            // Allow to omit extensions when requiring these files
            extensions: ['', '.js', '.jsx', '.styl', '.scss'],
            modulesDirectories: [
                'node_modules'
            ],
            alias: {
                'react': path.join(__dirname, 'node_modules/react/'),
                'sdk': path.join(__dirname, 'node_modules/gooddata/src/gooddata'),
                'jquery-browser': path.join(__dirname, 'node_modules/jquery.browser/dist/jquery.browser'),
                'jquery-extensions': path.join(__dirname, 'node_modules/goodstrap/packages/core/jquery-extensions')
            }
        },

        plugins: [
            new webpack.NormalModuleReplacementPlugin(/core\/styles\/themes\//, function(requestObject) {
                requestObject.request = requestObject.request.replace('./core/styles/themes/', '../../node_modules/goodstrap/packages/core/styles/themes/');
            }),
            new webpack.NormalModuleReplacementPlugin(/^\$$/, 'jquery'),
            new webpack.NormalModuleReplacementPlugin(/^jQuery$/, 'jquery'),
            new webpack.ProvidePlugin({
                React: 'react',
                $: 'jquery'
            })
        ]
    };
};

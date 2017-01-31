const path = require('path');

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
                    loader: 'babel',
                    include: [
                        path.join(__dirname, '/src'),
                        path.join(__dirname, '/example')
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
            extensions: ['', '.js', '.jsx', '.scss']
        },

        plugins: []
    };
};

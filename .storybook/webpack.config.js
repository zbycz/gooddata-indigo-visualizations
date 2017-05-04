module.exports = {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.(eot|woff|ttf|svg)/,
                loader: 'file-loader'
            }
        ]
    }
};

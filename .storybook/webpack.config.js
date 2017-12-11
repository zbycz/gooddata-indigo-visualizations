module.exports = (storybookBaseConfig, configType) => {
    if (configType === 'PRODUCTION') {
        // see https://github.com/storybooks/storybook/issues/1570
        storybookBaseConfig.plugins = storybookBaseConfig.plugins.filter(
            plugin => plugin.constructor.name !== 'UglifyJsPlugin'
        )
    }

    storybookBaseConfig.module = {
        rules: [
            ...storybookBaseConfig.module.rules,
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(eot|woff|ttf|svg)/,
                loader: 'file-loader'
            }
        ]
    };

    return storybookBaseConfig;
};

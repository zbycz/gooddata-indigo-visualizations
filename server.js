const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');

module.exports = {
    createMiddleware: function createMiddleware(webpackConfig, webpackOptions) {
        return (app) => {
            const compiler = webpack(webpackConfig);

            app.use(webpackDevMiddleware(compiler, webpackOptions));

            app.use(require('webpack-hot-middleware')(compiler));

            app.get('/', (req, res) => {
                res.sendfile(path.join(__dirname, '/index.html'));
            });
        };
    }
};

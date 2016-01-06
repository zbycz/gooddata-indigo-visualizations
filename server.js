var path = require('path');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');

module.exports = {
    createMiddleware: function createMiddleware(webpackConfig, webpackOptions) {
        return function(app) {
            var compiler = webpack(webpackConfig);

            app.use(webpackDevMiddleware(compiler, webpackOptions));

            app.use(require('webpack-hot-middleware')(compiler));

            app.get('/analyze/', function(req, res) {
                res.sendfile(path.join(__dirname, '/index.html'));
            });
        };
    }
};

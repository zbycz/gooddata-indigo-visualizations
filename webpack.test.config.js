var _ = require('lodash');
var getWebpackConfig = require('./webpack.config.js');

module.exports = function createTestConfig(options) {
    var testConfig = _.assign(getWebpackConfig(), {
        devtool: 'cheap-inline-source-map'
    });

    if (options.codeCoverage) {
        testConfig.module.postLoaders = testConfig.module.postLoaders || [];
        testConfig.module.postLoaders.push({
            test: /app\/.*\.(js$|jsx$)/,
            exclude: /(test|node_modules|app\/lib)\//,
            loader: 'istanbul-instrumenter'
        });
    }

    delete testConfig.entry;
    delete testConfig.output;

    return testConfig;
};

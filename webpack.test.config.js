var _ = require('lodash');
var getWebpackConfig = require('./webpack.config.js');

module.exports = function createTestConfig(options) {
    var testConfig = _.assign(getWebpackConfig(), {
        // cheap-inline-source-map breaks the code coverage
        devtool: options.codeCoverage ? '' : 'cheap-module-eval-source-map'
    });

    if (options.codeCoverage) {
        testConfig.module.postLoaders = testConfig.module.postLoaders || [];
        testConfig.module.postLoaders.push({
            test: /src\/.*\.(js$|jsx$)/,
            exclude: /(test|node_modules)\//,
            loader: 'istanbul-instrumenter'
        });
    }

    delete testConfig.entry;
    delete testConfig.output;

    return testConfig;
};

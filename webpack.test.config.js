const _ = require('lodash');
const getWebpackConfig = require('./webpack.config');

module.exports = function createTestConfig(options) {
    const testConfig = _.assign(getWebpackConfig(), {
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

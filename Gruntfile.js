// Copyright (C) 2007-2016, GoodData(R) Corporation. All rights reserved.
const webpackWebConfig = require('./webpack.web.config');
const webpackDevConfig = require('./webpack.dev.config');
const webpackTestConfig = require('./webpack.test.config');

module.exports = (grunt) => {
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-grizzly');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        main: {
            app: 'app', // TODO
            dist: 'dist',
            host: grunt.option('backend') || 'secure.gooddata.com',
            port: grunt.option('port') || 8443,
            webpackOptions: {
                progress: true,
                colors: true,
                publicPath: '/',
                keepAlive: true,
                stats: {
                    hash: false,
                    version: false,
                    timings: false,
                    assets: false,
                    chunks: false,
                    chunkModules: false,
                    chunkOrigins: false,
                    modules: false,
                    cached: false,
                    cachedAssets: false,
                    reasons: false,
                    children: false,
                    source: false,
                    errorDetails: true,
                    publicPath: false
                }
            }
        },

        clean: {
            web: './web'
        },

        karma: {
            options: {
                configFile: 'karma.conf.js',
                singleRun: grunt.option('ci')
            },
            unit: {}
        },

        eslint: {
            options: {
                config: '.eslintrc'
            },
            all: {
                src: [
                    '**/*.{js,jsx}',
                    '!web/**/*',
                    '!node_modules/**/*',
                    '!ci/**/*'
                ]
            }
        },

        webpack: {
            options: grunt.config.get('webpackOptions'),
            web: webpackWebConfig()
        },

        server: {
            dev: {},
            test: {}
        }
    });

    grunt.registerTask('test', ['karma:unit']);

    grunt.registerMultiTask('server', () => {
        const middlewareFactory = require('./server');
        const Grizzly = require('grunt-grizzly');

        const currentTask = grunt.task.current;
        const done = currentTask.async();

        const webpackConfig = currentTask.target === 'dev' ? webpackDevConfig : webpackTestConfig;
        const webpackOptions = grunt.config.get('main.webpackOptions');

        const options = {
            stub: middlewareFactory.createMiddleware(webpackConfig({
                port: grunt.config.get('main.port')
            }), webpackOptions),
            keepAlive: true,
            quiet: false,
            root: '',
            host: grunt.config.get('main.host'),
            port: grunt.config.get('main.port')
        };

        const grizzly = new Grizzly(options);

        // Shutdown & notify on error
        grizzly.on('error', (error) => {
            grunt.log.error('Grizzly error: %s', error);
            grunt.log.error('Stopping task grizzly');

            throw error;
        });

        grizzly.on('start', () => {
            // Continue to next task if keepAlive is not set
            if (!options.keepAlive) {
                done();
            }

            if (!options.quiet) {
                grizzly.printStartedMessage();
            }
        });

        grizzly.on('close', () => {
            grunt.log.error('Grizzly server closed');
            grunt.log.error('Stopping task grizzly');

            done();
        });

        // Start grizzly server
        grizzly.start();
    });

    grunt.registerTask('default', ['dev']);

    grunt.registerTask('validate', ['eslint']);

    // builds app with examples
    grunt.registerTask('web', [
        'clean:web',
        'webpack:web'
    ]);

    grunt.registerTask('dev', [
        'server:dev'
    ]);
};

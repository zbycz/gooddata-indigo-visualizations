// Copyright (C) 2007-2015, GoodData(R) Corporation. All rights reserved.
var webpackDistConfig = require('./webpack.dist.config.js');
var webpackDevConfig = require('./webpack.dev.config.js');
var webpackTestConfig = require('./webpack.test.config.js');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-grizzly');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        main: {
            app: 'app',
            dist: 'dist',
            host: grunt.option('backend') || 'secure.gooddata.com',
            port: grunt.option('port') || 8443,
            webpackOptions: {
                progress: true,
                colors: true,
                publicPath: '/analyze/',
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
            dist: './dist'
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
                    '!dist/**/*',
                    '!node_modules/**/*',
                    '!ci/**/*'
                ]
            }
        },

        webpack: {
            options: grunt.config.get('webpackOptions'),
            dist: webpackDistConfig
        },

        server: {
            dev: {},
            test: {}
        },

        test: {
            unit: {}
        }
    });

    grunt.registerTask('test', ['karma:unit']);

    grunt.registerMultiTask('server', function() {
        var middlewareFactory = require('./server.js');
        var done = this.async();
        var Grizzly = require('grunt-grizzly');

        var webpackConfig = this.target === 'dev' ? webpackDevConfig : webpackTestConfig;
        var webpackOptions = grunt.config.get('main.webpackOptions');

        var options = {
            stub: middlewareFactory.createMiddleware(webpackConfig({
                port: grunt.config.get('main.port')
            }), webpackOptions),
            keepAlive: true,
            quiet: false,
            root: '',
            host: grunt.config.get('main.host'),
            port: grunt.config.get('main.port')
        };

        var grizzly = new Grizzly(options);

        // Shutdown & notify on error
        grizzly.on('error', error => {
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

        grizzly.on('close', function() {
            grunt.log.error('Grizzly server closed');
            grunt.log.error('Stopping task grizzly');

            done();
        });

        // Start grizzly server
        grizzly.start();
    });

    grunt.registerTask('default', ['dev']);

    grunt.registerTask('validate', ['eslint']);

    grunt.registerTask('dist', [
        'clean:dist',
        'webpack:dist'
    ]);

    grunt.registerTask('dev', [
        'server:dev'
    ]);
};

// Copyright (C) 2007-2017, GoodData(R) Corporation. All rights reserved.
const checkstyleFormatter = require('stylelint-checkstyle-formatter');

const copyConfig = {
    expand: true,
    cwd: './src',
    src: ['**/*.{scss,eot,woff,ttf,svg}']
};

const babelConfig = {
    expand: true,
    cwd: './src',
    src: ['**/*.{jsx,js}', '!**/test/*'],
    ext: '.js'
};

module.exports = (grunt) => {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-stylelint');

    grunt.initConfig({
        clean: {
            prepublish: ['./lib', './es']
        },

        babel: {
            prepublish: {
                options: {
                    babelrc: false,
                    presets: [
                        'es2015',
                        'react',
                        'stage-0'
                    ],
                    plugins: [
                        'lodash'
                    ]
                },
                files: [
                    Object.assign({}, babelConfig, { dest: './lib' })
                ]
            },
            prepublishEs: {
                files: [
                    Object.assign({}, babelConfig, { dest: './es' })
                ]
            }
        },

        copy: {
            prepublish: {
                files: [
                    Object.assign({}, copyConfig, { dest: './lib' }),
                    Object.assign({}, copyConfig, { dest: './es' })
                ]
            }
        },

        eslint: {
            options: {
                config: '.eslintrc'
            },
            all: {
                src: [
                    '**/*.{js,jsx}',
                    '!{ci,es,gdc-ci,lib,node_modules,coverage,dist-storybook}/**/*'
                ]
            }
        },

        stylelint: {
            all: {
                options: {
                    formatter: grunt.option('ci') && checkstyleFormatter,
                    outputFile: grunt.option('ci') && 'ci/results/stylelint-results.xml'
                },
                src: [
                    'src/styles/**/*.scss'
                ]
            }
        }
    });

    grunt.registerTask('prepublish', [
        'clean:prepublish',
        'babel',
        'copy'
    ]);

    grunt.registerTask('validate', ['eslint', 'stylelint']);
};

// Copyright (C) 2007-2017, GoodData(R) Corporation. All rights reserved.
const checkstyleFormatter = require('stylelint-checkstyle-formatter');

module.exports = (grunt) => {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-stylelint');

    grunt.initConfig({
        clean: {
            prepublish: './lib'
        },

        babel: {
            prepublish: {
                files: [{
                    expand: true,
                    cwd: './src',
                    src: ['**/*.{jsx,js}', '!**/test/*'],
                    dest: './lib',
                    ext: '.js'
                }]
            }
        },

        copy: {
            prepublish: {
                files: [{
                    expand: true,
                    cwd: './src',
                    src: [
                        '**/*.{scss,eot,woff,ttf,svg}'
                    ],
                    dest: './lib'
                }]
            }
        },

        eslint: {
            options: {
                config: '.eslintrc'
            },
            all: {
                src: [
                    '**/*.{js,jsx}',
                    '!{ci,lib,node_modules,coverage,dist-storybook}/**/*'
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
        'babel:prepublish',
        'copy:prepublish'
    ]);

    grunt.registerTask('validate', ['eslint', 'stylelint']);
};

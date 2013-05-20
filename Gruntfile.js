var fs = require('fs'),
    path = require('path'),
    tasks = JSON.parse(fs.readFileSync(__dirname + path.sep + 'package.json')).devDependencies;

module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        files: {
            src: ['index.js', 'lib/**/*.js'],
            test: ['test/**/*.js'],
            all: ['README.md', 'index.js', 'lib/**/*.js', 'test/**/*.js'],
            ignored: ['README.md', 'node_modules/**', 'test/**', 'docs/**', '.vagrant/**']
        },

        jshint: {
            files: '<%= files.all %>',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            docs: ['docs'],
            coverage: ['coverage']
        },

        nodemon: {
            dev: {
                options: {
                    file: 'index.js',
                    ignoredFiles: '<%= files.ignored %>',
                    debug: true
                }
            }
        },

        plato: {
            docs: {
                options: '<%= jshint %>',
                files: {
                    'docs/complexity': '<%= files.src %>',
                }
            }
        },

        dox: {
            voyeur: {
                expand: true,
                src: '<%= files.src %>',
                dest: 'docs/annotated/',
                ext: '.md',
                options: { api: 'true' }
            }
        },

        coverage: {
            test: {
                files: { 'coverage': 'lib' }
            }
        },

        cafemocha: {
            unit: {
                src: '<%= files.test %>',
                options: {
                    ui: 'exports',
                    reporter: 'nyan'
                }
            },
            coverage: {
                files: { 'coverage/index.html': '<%= cafemocha.unit.src %>'},
                options: {
                    ui: 'exports',
                    reporter: 'html-cov',
                    env: 'VOYEUR_COVERAGE'
                }
            }
        }

    });

    grunt.registerMultiTask('dox', 'Create dox documentation', function () {

        var dox = require('dox'),
            util = require('util'),
            options = this.options({ separator: grunt.util.linefeed }),
            isFile = function (filepath) {
                // Check if file exists
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }

                return true;

            },
            doc = function (file) {
                // Document the file
                var source = grunt.file.read(file);
                return dox.parseComments(source, { raw: options.raw || options.api });
            };

        grunt.verbose.writeflags(options, 'Options');

        this.files.forEach(function (files) {

            var output = files.src
                .filter(isFile)
                .map(doc);

            // Write the file
            if (options.debug) {
                grunt.log.write((util.inspect(output, false, Infinity, true) + '\n'));
            } else if (options.api) {
                grunt.file.write(files.dest, dox.api(output));
            } else {
                grunt.file.write(files.dest, JSON.stringify(output, null, 2));
            }

            // Warn if file was empty or correctly created
            return (output.length < 1) ?
                    grunt.log.warn('File ' + files.dest + ' created empty, because its counterpart was empty.') :
                    grunt.log.ok('File ' + files.dest + ' created.');

        });


    });

    grunt.registerMultiTask('coverage', 'Create code coverage', function () {

        var spawn = require('child_process').spawn,
            done = this.async(),
            coverage = spawn('jscoverage', [this.files[0].src, this.files[0].dest]),
            error;

        coverage.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        coverage.stderr.on('data', function (data) {
            error = new Error(data.toString());
        });

        coverage.on('close', function (code) { done(error); });

    });

    // Load Grunt Tasks
    Object.keys(tasks).forEach(function (key) {
        return (/^grunt-/).test(key) && grunt.loadNpmTasks(key);
    });

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['nodemon']);
    grunt.registerTask('test', ['jshint', 'cafemocha:unit', 'cov']);
    grunt.registerTask('cov', ['clean:coverage', 'coverage:test', 'cafemocha:coverage']);
    grunt.registerTask('docs', ['clean:docs', 'plato:docs', 'dox:voyeur']);
};

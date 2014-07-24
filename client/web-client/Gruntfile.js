module.exports = function (grunt) {

    var devTasks = ['copy', 'concat', 'devcode:dev'];

    grunt.file.defaultEncoding = 'utf-8';

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            htmls: {
                files: [{
                    expand: true,
                    cwd: 'html',
                    src: ['**/*.html'],
                    dest: 'build'
                }]
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
                process: function (src, filepath) {
                    return '// Source: ' + filepath + "\n\n" + src + "\n\n" + "// End Source: " + filepath + "\n";
                }
            },
            css: {
                options: {
                    process: function (src, filepath) {
                        src = src.replace(/sourceMappingURL/g, 'sourceMappingURL.beforeconcat').replace(/\.\.\/fonts/g, 'fonts');
                        return '/* Source: ' + filepath + "*/\n\n" + src + "\n\n" + "/* End Source: " + filepath + "*/\n";
                    }
                },
                src: [
                    'css/**/*.css'

                ],
                dest: 'build/style.css'

            },
            angularJs: {
                src: [
                    'js/app.js',
                    'js/controller/MainController.js',
                    'js/controller/**/*.js'
                ],
                dest: 'build/app.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                // important to make angular js work, see: 
                // http://stackoverflow.com/questions/17238759/angular-module-minification-bug
                mangle: false
            },
            angularJs: {
                src: 'build/app.js',
                dest: 'build/app.min.js',
                options: {
                    sourceMap: true,
                    sourceMapName: 'build/app.js.map'
                },
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/',
                ext: '.min.css'
            }
        },
        devcode: {
            options: {
                html: true,
                js: true,
                css: true,
                clean: true,
                block: {
                    open: 'devcode',
                    close: 'endcode'
                },
                dest: 'build'
            },
            dev: { // settings for task used with 'devcode:server'
                options: {
                    source: 'build/',
                    dest: 'build/',
                    env: 'development'
                }
            },
            prod: { // settings for task used with 'devcode:dist'
                options: {
                    source: 'build/',
                    dest: 'build/',
                    env: 'production'
                }
            }
        },
        connect: {
            server: {
                options: {
                    livereload: true,
                    port: 10180,
                    base: 'build'
                }
            },
        },
        watch: {
            options: {
                livereload: true,
            },
            css: {
                files: ['css/**/*.css'],
                tasks: devTasks
            },
            html: {
                files: ['html/**/*.html'],
                tasks: devTasks
            },
            js: {
                files: ['js/**/*.js'],
                tasks: devTasks
            }
        },
    });

    // loading the dependencies
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-devcode');

    // registering tasks
    grunt.registerTask('default', devTasks);
    grunt.registerTask('serve', devTasks.concat(["connect:server", "watch"]));
    grunt.registerTask('prod', ['copy', 'concat', 'uglify', 'cssmin:minify', 'devcode:prod']);

};
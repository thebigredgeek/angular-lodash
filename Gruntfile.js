
'use strict';

module.exports = function(grunt){

  var config = {

    module: {
      pkg: grunt.file.readJSON('./bower.json'),
      alias: 'tbrg.lodash',
      dist: 'dist',
      staging: '.tmp',
      components: grunt.file.readJSON('./.bowerrc').directory,
      banner: '/* License MIT */\n',
      src: 'src'
    },

    concat: {

      javascript: {

        options: {
          separator: ';'
        },

        src: [
          '<%= module.src %>/main.js',
          '<%= module.src %>/!(tests)/*.js',
          '<%= module.staging %>/templates.js'
        ],

        dest: '<%= module.staging %>/<%= module.pkg.name %>.js'

      },

      styles: {

        src: [
          '<%= module.staging %>/styles/*.css'
        ],

        dest: '<%= module.staging %>/<%= module.pkg.name %>.css'

      }

    },

    cssmin: {

      dist: {

        options: {
          banner: '<%= module.banner %>'
        },

        files: {
          '<%= module.dist %>/<%= module.pkg.name %>.min.css': ['<%= module.dist %>/<%= module.pkg.name %>.css']
        }

      }


    },

    uglify: {

      dist: {

        options: {
          sourceMap: true,
          mangle: false,
          banner: '<%= module.banner %>',
          wrap: '<%= module.alias %>'
        },

        files: {
          '<%= module.dist %>/<%= module.pkg.name %>.min.js': ['<%= module.dist %>/<%= module.pkg.name %>.js']
        }

      }

    },

    copy: {
      styles: {
        files: [
          {
            expand: true,
            cwd: '<%= module.staging %>/',
            src: ['<%= module.pkg.name %>.css'],
            dest: '<%= module.dist %>/',
            filter: 'isFile'
          }
        ]
      },

      javascript: {
        files: [
          {
            expand: true,
            cwd: '<%= module.staging %>/',
            src: ['<%= module.pkg.name %>.js'],
            dest: '<%= module.dist %>/',
            filter: 'isFile'
          }
        ]
      },

      components: {
        files: [
          {
            expand: true,
            src: '<%= module.components %>/**/*.*',
            dest: '<%= module.staging %>/'
          }
        ]
      },

      index: {
        files: [
          {
            expand: true,
            src: ['index.html'],
            dest: '<%= module.staging %>/',
            filter: 'isFile'
          }
        ]
      },

      images: {
        files: [
          {
            expand: true,
            cwd: '<%= module.src %>/',
            src: ['images/*'],
            dest: '<%= module.staging %>/',
            filter: 'isFile'
          }

        ]
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src:[
          'Gruntfile.js',
          '<%= module.src %>/main.js',
          '<%= module.src %>/controllers/*.js',
          '<%= module.src %>/directives/*.js',
          '<%= module.src %>/providers/*.js',
          '<%= module.src %>/services/*.js'
        ]
      },
      tests: {
        options: {
          jshintrc: '.jasminejshintrc'
        },
        src: [
          '<%= module.src %>/tests/*.spec.js'
        ]
      }
    },
    less: {
      options: {
        ieCompat: true
      },
      styles: {
        expand: true,
        cwd: '<%= module.src %>/',
        dest: '<%= module.staging %>/',
        src: 'styles/*.less',
        ext: '.css'
      }
    },
    watch: {

      styles: {
        files: ['<%= module.src %>/styles/*.less'],
        tasks: ['less','concat:styles', 'autoprefixer'],
        options: {
          atBegin: true
        }
      },

      javascript: {
        files: [
          '<%= module.src %>/main.js',
          '<%= module.src %>/controllers/*.js',
          '<%= module.src %>/directives/*.js',
          '<%= module.src %>/providers/*.js',
          '<%= module.src %>/services/*.js'
        ],
        tasks: ['newer:jshint:src','concat:javascript'],
        options: {
          atBegin: true
        }
      },

      views: {
        files: [
          '<%= module.src %>/views/*.html'
        ],
        tasks: ['ngtemplates','jshint:src','concat:javascript'],
        options: {
          atBegin: true
        }
      },

      index: {
        files: [
          'index.html'
        ],
        tasks: ['copy:index'],
        options: {
          atBegin: true
        }
      },

      images: {
        files: [
          '<%= module.src %>/images/*.*'
        ],
        tasks: ['copy:images'],
        options: {
          atBegin: true
        }
      },

      components: {
        files: [
          '<%= module.components %>/*'
        ],
        tasks: ['copy:components','bowerInstall'],
        options: {
          atBegin: true
        }
      },

      tests: {
        files: [
          '<%= module.src %>/tests/*.spec.js'
        ],
        tasks: ['newer:jshint:tests', 'karma:precompile'],
        options: {
          atBegin: true
        }
      }

    },

    karma: {

      precompile: {
        configFile: 'karma.precompile.conf.js'
      },

      postcompile: {
        configFile: 'karma.postcompile.conf.js'
      }

    },
    ngtemplates: {

      dist: {
        cwd: '<%= module.src %>/',
        src: 'views/*.html',
        dest: '<%= module.staging %>/templates.js',
        options: {
          htmlmin: {
            collapseWhitespace: true,
            removeComments: true
          },
          module: '<%= module.alias %>',
          url: function(url){
            return config.module.pkg.name + '/' + url;
          }
        }
      }

    },

    bowerInstall: {

      index: {
        dependencies: true,
        devDependencies: false,
        src: ['index.html']
      },

      tests: {
        src: ['karma.precompile.conf.js', 'karma.postcompile.conf.js'],
        dependencies: true,
        devDependencies: true,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            detect: {
              js: /'.*\.js'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%'] //prefix all browsers with greater than 1% global usage
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '<%= module.pkg.name %>.css',
          dest: '.tmp/'
        }]
      }
    },

    cssUrlEmbed: {
      dist: {
        files: {
          '<%= module.dist %>/<%= module.pkg.name %>.css': ['<%= module.dist %>/<%= module.pkg.name %>.css']
        },
        options: {
          baseDir: './src'
        }
      }
    },

    clean: {
      dist: '<%= module.dist %>',
      staging: '<%= module.staging %>'
    }

  };

  require('load-grunt-tasks')(grunt);

  grunt.initConfig(config);

  grunt.registerTask('default',[
    'clean:staging',
    'watch'
  ]);

  grunt.registerTask('build',[
    'clean:staging',
    'jshint',
    'ngtemplates',
    'concat:javascript',
    'bowerInstall',
    'karma:precompile',
    'less',
    'ngtemplates',
    'concat:styles',
    'autoprefixer',
    'clean:dist',
    'copy:styles',
    'copy:javascript',
    'copy:images',
    'cssUrlEmbed',
    'cssmin',
    'uglify',
    'karma:postcompile'
  ]);

};

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      target: {
        files: {
          'public/dist/libraries.js': ['public/lib/jquery.js',
                                       'public/lib/underscore.js',
                                       'public/lib/backbone.js',
                                       'public/lib/handlebars.js'],
          'public/dist/client.js': ['public/client/*']
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    gitpush: {
      target: {
        options: {
          remote: 'live'
        }
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          delay: 1000
        }
      }
    },

    uglify: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/dist/',
          src: ['*.js', '!*.min.js'],
          dest: 'public/dist/',
          ext: '.min.js'
        }]
      }
    },

    eslint: {
      target: ['public/client/*']
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'build',
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'build', 'concurrent' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['eslint', 'concat', 'uglify', 'cssmin' /*, 'test' */]);

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      // Is true when "grunt deploy --prod" is run
      grunt.task.run(['build', 'gitpush']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });
};

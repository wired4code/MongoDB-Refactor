module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
          seperator: ';'
      },
      lib: {
        src: [
        'public/lib/jquery.js',
        'public/lib/underscore.js',
        'public/lib/handlebars.js',
        'public/lib/backbone.js',
        ],
        dest: 'public/dist/lib.js'
      },

      prod: {
        src: [
        'public/client/*.js'
        ],
        dest: 'public/dist/prod.js'
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

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      scripts: {
        files: {
          'public/dist/lib.min.js': ['public/dist/lib.js'],
          'public/dist/prod.min.js': ['public/dist/prod.js']
        }
      }
    },

    jshint: {
      files: [
        'public/**/*.js', 'app/**/*.js', 'app/*.js', 'lib/*.js', '*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: 'public',
            src: ['*.css', '!*.min.css'],
            dest: 'public/dist',
            ext: '.min.css'
          }
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      heroku: {
        command: 'git push heroku master',
        options: {
          stderr: true,
          stdout: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'cssmin',
    'jshint',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('heroku', ['shell:heroku']);

  grunt.registerTask('heroku:production', ['build', 'test']);

  grunt.registerTask('heroku:staging', ['build', 'test']);

  /*grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['deploy']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });*/

  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['heroku']);
    } else {
      grunt.task.run([ 'build', 'test', 'server-dev' ]);
    }
  });

};

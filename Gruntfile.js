/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      plugin: {
        files: [{
          expand: true,
          cwd: 'js/',
          src: '*.js',
          dest: 'js/',
          ext: '.min.js'
        }],
        options: {
          banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        }
      }
    },
    stylus: {
      compile: {
        files: [
          {src: 'stylus/miniponies.styl', dest: 'css/miniponies.css'}
        ]
      },
      demo: {
        files: [
          {src: 'stylus/miniponies.demo.styl', dest: 'css/miniponies.demo.css'}
        ]
      }
    },
    coffee : {
      compile : {
        files: [
          {src: 'coffee/miniponies.coffee', dest: 'js/miniponies.js'}
        ]
      },
      demo : {
        files: [
          {src: 'coffee/miniponies.demo.coffee', dest: 'js/miniponies.demo.js'}
        ]
      }
    },
    watch : {
      files: [
        'coffee/*.coffee',
        'spec/coffee/**/*.coffee',
        'stylus/*.styl'
      ],
      tasks: ['coffee', 'notify:coffee', 'stylus', 'notify:stylus'],
      options: {
        livereload: true
      }
    },
    connect: {
      demo: {
        options: {
          hostname: 'localhost',
          port: 55555,
          base: '.',
          keepalive: true,
          livereload: true,
          useAvailablePort: true,
          open: true
        }
      }
    },
    notify: {
      coffee: {
        options: {
          title: 'Coffee Compiled',
          message: 'Coffee files compiled successfully.'
        }
      },
      stylus: {
        options: {
          title: 'Stylus Compiled',
          message: 'Stylus files compiled successfully.'
        }
      },
      connect: {
        options: {
          title: 'Server Started',
          message: 'Server started on port <%= connect.demo.options.port %>'
        }
      }
    }
  });

  // Lib tasks.
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default and Build tasks
  mainTasks = ['coffee', 'notify:coffee', 'stylus', 'notify:stylus'];
  devTasks = ['watch'];
  grunt.registerTask('server', ['connect', 'notify:connect']);
  grunt.registerTask('default', mainTasks);
  grunt.registerTask('dev', devTasks);
  grunt.registerTask('build', mainTasks.concat(['uglify']));

  // Travis CI task.
  grunt.registerTask('travis', ['coffee', 'stylus']);
};

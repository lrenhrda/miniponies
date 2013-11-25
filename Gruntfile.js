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
        files: {
          'css/site.css': 'css/site.styl'
        }
      }
    },
    coffee : {
      plugin : {
        files: [{
          expand: true,
          cwd: 'js/',
          src: '*.coffee',
          dest: 'js/',
          ext: '.js'
        }]
      },
      specs : {
        files: [{
          expand: true,
          cwd: 'spec/coffeescripts/',
          src: '*.coffee',
          dest: 'spec/javascripts/',
          ext: '.js'
        }]
      },
      helpers : {
        files: [{
          expand: true,
          cwd: 'spec/coffeescripts/helpers/',
          src: '*.coffee',
          dest: 'spec/javascripts/helpers/',
          ext: '.js'
        }]
      }
    },
    watch : {
      files: [
        'js/*.coffee',
        'spec/coffeescripts/**/*.coffee',
        'css/*.styl'
      ],
      tasks: ['coffee', 'growl:coffee', 'stylus', 'growl:stylus']
    },
    growl : {
      coffee : {
        title   : 'CoffeeScript',
        message : 'Compiled successfully'
      },
      stylus : {
        title   : 'Stylus',
        message : 'Compiled successfully'
      }
    }
  });

  // Lib tasks.
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default and Build tasks
  mainTasks = ['coffee', 'growl:coffee', 'stylus', 'growl:stylus'];
  grunt.registerTask('default', mainTasks);
  grunt.registerTask('build', mainTasks.concat(['uglify']));

  // Travis CI task.
  grunt.registerTask('travis', ['coffee', 'stylus']);
};

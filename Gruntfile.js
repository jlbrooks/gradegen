module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Sass config
    sass: {
      dist: {
        options: {
          loadPath: ['generator/static/bower/foundation-sites/scss'],
          style: 'expanded'
        },
        files: {
          'generator/static/css/main.css': 'generator/static/sass/main.scss'
        }
      }
    },
    browserify: {
      dist: {
        options: {
          // babel transform for JSX
          transform: ['reactify']
        },
        files: {
          'generator/static/js/bundle.js': 'generator/static/js/components/main.js'
        }
      }
    },
    watch: {
      css: {
        files: ['generator/static/sass/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['generator/static/js/components/*.js'],
        tasks: ['browserify']
      }
    }
  });

  // Load sass task
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Load browserify task
  grunt.loadNpmTasks('grunt-browserify');
  // Watch task
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default tasks
  grunt.registerTask('default', ['sass', 'browserify']);
};
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    }
  });

  // Load sass task
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default tasks.
  grunt.registerTask('default', ['sass']);
};
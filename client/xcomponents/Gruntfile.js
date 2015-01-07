module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/* <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd h:MM") %> */\n',
    
    /*clean the output folder*/
    clean:{
      build : {
        src : ["dist"]
      },
      tmp : {
        src : ["dist/xcomponents-tmp.js", "dist/templates.js"]
      }

    },

    /*contact all js source files*/
    concat: {
      js1 : {
        options: { banner: '<%= banner %>' },
        src: [
          'src/*.js',
          '!src/xc-main.js'
        ],
        dest: 'dist/xcomponents-tmp.js'
      }, 
      js2 : {
        src: [
          'src/xc-main.js',
          'dist/xcomponents-tmp.js',
          'dist/templates.js'
        ],
        dest: 'dist/xcomponents.js'
      } 

    },

    /*create Angular JS files from the partials (html files)*/
    html2js : {
      options: {
      },
      main: {
        src: ['src/*.html'],
        dest: 'dist/templates.js'
      }
    },

    watch : {

      scripts: {
        files: ['**/*.js', '**/*.html'],
        tasks: ['default'],
        options: {
          spawn: false,
        }
      }
    },

    uglify: {
      build: {
        files: {
          'dist/xcomponents.min.js': ['dist/xcomponents.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('default', [
    'clean:build',
    'html2js',
    'concat:js1',
    'concat:js2',
    'clean:tmp',
   ]);

};
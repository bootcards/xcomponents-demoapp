module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/* <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd h:MM") %> */\n',
    
    /*clean the output folder*/
    clean: ["dist"],

    /*copy html templates to dist folder*/
    /*copy: {
      main: {
        files: [
          {expand: true, src: ['src/*.html'], dest: 'dist/', filter: 'isFile', flatten: true},
        ]
      }
    },*/

    /*contact all js source files*/
    concat: {
      js : {
        options: { banner: '<%= banner %>' },
        src: [
          'src/xc-main.js',
          'src/xc-header.js',
          'src/xc-footer.js',
          'src/xc-summary.js',
          'src/xc-summary-item.js',
          'src/xc-login.js',
          'src/xc-list-v2.js',
          'src/xc-image.js',
          'src/xc-card.js',
          'src/xc-chart.js',
          'src/xc-image.js'
        ],
        dest: 'dist/xcomponents.js'
      },    
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
        files: ['**/*.js'],
        tasks: ['default'],
        options: {
          spawn: false,
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', [
    'clean',
    'concat:js',
    'html2js'
  ]);

};
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // file watching
    watch: {
      coffee: {
        files: ["app/js/*.coffee"],
        tasks: ["doCoffee"]
      },
      js: {
        files: ["app/js/*.js", "!app/js/*.min.js"], // ignore minified js files
        tasks: ["doJs"]
      },
      template: {
        files: ["app/template/**/*.html"],
        tasks: ["doTemplate"]
      },
      less: {
        files: ["app/css/*.less"],
        tasks: ["doLess"]
      }
    },

    // ######## tasks

    // minify files
    uglify: {
      options: {
        verbose: true,
        mangle: false,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'app/js/common.min.js': ["app/js/common.js"],
        }
      }
    },

    // compile coffee files
    coffee: {
      glob_to_multiple: {
        expand: true,
        cwd: '.',
        src: ['app/js/*.coffee'],
        dest: '.',
        ext: '.js'
      }
    },

    // lint non minified files
    jshint: {
      files: ["app/js/*.js", "!app/js/*.min.js"], // ignore min files
      options: {
        curly: true, // require curly braces
        eqeqeq: true, // disable ==, etc.
        browser: true, // browser variables
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          window: true
        }
      }
    },

    less: {
      development: {
        options: {
          compress: true
        },
        files: {
          "app/css/style.css": "app/css/style.less"
        }
      }
    },

    // underscore template compiler
    jst: {
      compile: {
        options: {
          namespace: "Template",
          prettify: true,
          templateSettings: {
            escape: /\{\{(.+?)\}\}/g,
            evaluate: /\{\%(.+?)\%\}/g
          }
        },
        files: {
          "app/template/templates.js": ["app/template/**/*.html"]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask("doCoffee", function() {
    grunt.task.run("coffee");
  });

  grunt.registerTask("doJs", function() {
    grunt.task.run("jshint");
    grunt.task.run("uglify");
  });

  grunt.registerTask("doTemplate", function() {
    // precompile underscore templates
    grunt.task.run("jst");
  });

  grunt.registerTask("doLess", function() {
    grunt.task.run("less");
  });

  grunt.registerTask("initialize", function() {
    grunt.task.run("doCoffee");
    grunt.task.run("doJs");
    grunt.task.run("doTemplate");
    grunt.task.run("doLess");
  });

  // ######## build
  grunt.registerTask("build", function() {
    var exec = require('child_process').exec;
    var done = this.async();
    
    // remove old builds
    exec("rm -r platform/android/assets/www; rm -r platform/ios/www", function(err, s, e) {
      console.log(s);
      console.log(err);
      console.log(e);
    });
    
    // copy builds
    exec("cp -r app platform/android/assets/www; cp -r app platform/ios/www", function(err, s, e) {
      console.log(s);
      console.log(err);
      console.log(e);
      done();
    });
  });

  // ######## develop
  grunt.registerTask("default", ["initialize", "watch"]);
};

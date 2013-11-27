module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat : {
			options : {
				separator : ';',
				stripBanners : true,
				banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			dist : {
				files : {
					'dist/<%= pkg.name %>.js' : 'source/**/*.js',
					'dist/templates.html' : 'source/tpl/*.html',
				}
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist : {
				files : {
					'dist/<%= pkg.name %>.min.js' : ['dist/<%= pkg.name %>.js']
				}
			}
		},
		jasmine : {
			pivotal : {
				src : 'source/js/*.js',
				options : {
					specs : 'source/test/spec/*Spec.js',
					helpers : 'source/test/src/*.js'
				}
			}
		},
		jshint : {
			files : ['Gruntfile.js', 'source/js/**/*.js'],
			options : {
				smarttabs : false,
				laxcomma : true,
				globals : {
					jQuery : true,
					console : true,
					module : true,
					document : true
				}
			}
		},
		watch : {
			files : ['<%= jshint.files %>'],
			tasks : ['jshint', 'qunit']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('test', ['jshint', 'jasmine']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
}; 
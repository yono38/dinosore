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
					'dist/<%= pkg.name %>.css' : ['source/**/*.css'],
					'dist/<%= pkg.name %>.js' : ['source/**/*.js', 'source/js/!(config).js'],
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'build/www/css/<%= pkg.name %>.min.css' : ['dist/<%= pkg.name %>.css']
				}
			}
		},
		copy: {
			img: {
				files: [
					{expand: true, cwd: 'source/img/', src: ['**'], dest: 'build/phonegap/www/img'},
				]
			},
			cssimg: {
				files: [
					{expand: true, cwd: 'source/css/images/', src: ['**'], dest: 'build/phonegap/www/css/images'},
				]
			}
		},
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist : {
				files : {
					'build/www/js/<%= pkg.name %>.min.js' : ['dist/<%= pkg.name %>.js'],
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
		execute: {
			simple_target: {
				// execute javascript files in a node child_process
				src: ['deploy.js']
			},
		},
		watch : {
			files : ['<%= jshint.files %>'],
			tasks : ['jshint']
		}
	});

	// ========================
	// LOAD TASKS
	// ========================
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	// ========================
	// CUSTOM TASKS
	// ========================
	grunt.registerTask('tplconcat', 'Concats templates with script tag specified header and footer', function() {
		// TODO further replace FS with grunt.file
		var fs = require('fs'),
			path = require('path');
		
		console.log('Concatinating templates for production..');
		var tplDir = path.normalize('./source/tpl/'),
			resultFileName = path.normalize('./build/phonegap/www/templates.html');
		var final = grunt.file.delete(resultFileName, {force: true});
		var tpls = grunt.file.expand({
			cwd: tplDir	
		}, '*.html');
		
		tpls.forEach(function(tpl, idx, arr) {
			console.log(tpl);
			// remove .html from name
			var tplName = path.basename(tpl, '.html');
			fs.appendFileSync(resultFileName, '<!---- ============== '+tplName+' ============== ---->\n<script type="template" id="'+tplName+'">\n');
			var tplFileContents = grunt.file.read(tplDir + tpl);
			fs.appendFileSync(resultFileName, tplFileContents);
			fs.appendFileSync(resultFileName, '</script>\n\n');
		});
		console.log('Templates succesfully concatinated');
    });
    
    // ========================
    // NAME GRUNT TASKS
    // ========================
	grunt.registerTask('test', ['jshint', 'jasmine']);
	grunt.registerTask('default', ['jshint', /*jasmine,*/ 'concat', 'cssmin', 'uglify', 'copy', 'tplconcat']);
	grunt.registerTask('deploy', ['jshint', /*jasmine,*/ 'concat', 'cssmin', 'uglify', 'copy', 'tplconcat', 'execute']);
}; 
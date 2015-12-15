// SETUP {
	
	/*
		VERSIONING

			versioning via bump: https://github.com/vojtajina/grunt-bump

			step 1

				grunt uglify
				grunt sass

			step 2

				grunt bump:patch	1.0.0 -> 1.0.1
				grunt bump:minor	1.0.1 -> 1.1.0
				grunt bump:major	1.1.0 -> 2.0.0
				grunt bump --setversion=1.7.8

			step 3

				After bumping run following grunt tasks 
				to update the version to all files:

				grunt uglify
				grunt sass

	*/

	var setup = {};

	setup.banner = '/*\r\n' +
	' * @package		<%= pkg.name %>\r\n' +
	' * @version		<%= pkg.version %>\r\n' +
	' * @date		<%= grunt.template.today("yyyy-mm-dd") %>\r\n' +
	' * @time		<%= grunt.template.today("H:MM:ss") %>\r\n' +
	' * @license		<%= pkg.license %>\r\n' + 
	' * @repository	<%= pkg.repository.url %>\r\n' + 
	' * @homepage	<%= pkg.homepage %>\r\n' + 
	' */\r\n';

	setup.uglify_options = {
		compress: true,
		mangle: true,
		report: 'gzip',
		banner: setup.banner,
	};

// }

module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		bump: {
		  options: {
			files: ['package.json'],
			updateConfigs: [],
			commit: false,
			push: false,
		  }
		},

		uglify: {
			core_yerslider: {
				files: {
					'core/yerslider.min.js': 'core/yerslider.js',
				},
				options: setup.uglify_options
			},
			theme_default: {
				files: {
					'themes/default/yerslider.min.js': 'themes/default/yerslider.js',
				},
				options: setup.uglify_options
			}
		},

		sass: {
			expanded: {
				options: {
					style: 'expanded',
					//banner: setup.banner,
				},
				files: [{
					expand: true,
					cwd: 'themes/',
					src: ['**/*.scss'],
					dest: 'themes/',
					ext: '.css',
					extDot: 'first'
				}]
			},
			min: {
				options: {
					style: 'compressed',
					//banner: setup.banner,
				},
				files: [{
					expand: true,
					cwd: 'themes/',
					src: ['**/*.scss'],
					dest: 'themes/',
					ext: '.min.css',
					extDot: 'first'
				}]
			}
		},

		concat: {
			options: {
				separator: "\n\n",
				banner: '',
				footer: '',
			},
			demojs: {
				src: [
					'dependencies/imagesloaded.js',
					'dependencies/jquery.touchSwipe.js',
					'themes/default/yerslider.min.js',
					'core/yerslider.min.js',
				],
				dest: 'demo/js/demo.yerslider.js',
			},
		},

		watch: {
			//livereload: {
			//	files: ['core/*','demo/**/*','themes/**/*'],
			//	options: {
			//		livereload: true,
			//    },
			//},
			demojs: {
				files: ['core/*','dependencies/**/*','themes/**/*'],
				tasks: ['concat:demojs'],
			},
			watch_core_yerslider: {
				files: ['core/yerslider.js'],
				tasks: ['uglify:core_yerslider'],
			},
			watch_theme_default_js: {
				files: ['themes/default/yerslider.js'],
				tasks: ['uglify:theme_default'],
			},
			watch_theme_default_styles: {
				files: ['themes/default/yerslider-styles.scss'],
				tasks: ['sass'],
			},
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('default', ['watch']);

};
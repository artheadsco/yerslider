module.exports = function(grunt) {
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        uglify: {
            yerslider_production: {
                options: {
                    compress: true,
                    mangle: true,
                    report: 'gzip',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %>' +
                    ', license <%= pkg.license %> */\n',
                },
                files: {
                    'core/yerslider.min.js': 'core/yerslider.js',
                }
            }
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('default', []);
    grunt.registerTask('min', ['uglify:yerslider_production']);

};
var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    browserify = require('browserify'),
    fs = require('fs'),
    glob = require('glob'),
    async = require('async'),
    runSequence = require('run-sequence'),
    argv = process.argv;


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);
gulp.task('upload:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');
var tslint = require('ionic-gulp-tslint');

var isRelease = argv.indexOf('--release') > -1;

var shouldSkipBuild = argv.indexOf('--skip-build') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts', 'octokat'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

if (shouldSkipBuild) {
  gulp.task('build:prequel', function(done) {
    done();
  });
}
else {
  gulp.task('build:prequel', ['clean'], function(done){
    runSequence(
      ['sass', 'html', 'fonts', 'scripts', 'octokat'],
      function(){
        buildBrowserify({
          minify: isRelease,
          browserifyOptions: {
            debug: !isRelease
          },
          uglifyOptions: {
            mangle: false
          }
        }).on('end', done);
      }
    );
  });
}

gulp.task('inline', function(done) {
  var rootPath = './www/build'
  glob(rootPath + '/**/*.html', function(e,files) {
    var indexPath = rootPath + '/js/app.bundle.js'
    var js = fs.readFileSync(indexPath, 'utf8');

    async.eachSeries(files, function(file, callback) {
      filename = file.substr(6)
      var html = fs.readFileSync(file, 'utf8');
      html = html.replace('\n','');
      js = js.replace('templateUrl:"' + filename + '"', "template: `" + html +"`")
      callback()
    }, function() {
      fs.writeFile(indexPath, js, 'utf8', function(err, data) {
        done()
      });
    })
  })
})

gulp.task('build', ['build:prequel'], function(done) {
  runSequence(
    ['inline']
  )
})

gulp.task('sass', function() {
  return buildSass({
    includePaths: [
      'node_modules/ionic-angular',
      'node_modules/ionicons/dist/scss'
    ]
  })
});
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);

gulp.task('octokat', function(done) {
  var b = browserify();
  b.add('./github.js');
  var rootPath = './www/build/js';
  b.bundle((err, buf) => {
    fs.writeFile(rootPath + '/github.js', buf, () => {
      return done();
    })
  })
})

gulp.task('clean', function(){
  return del('www/build');
});
gulp.task('lint', tslint);

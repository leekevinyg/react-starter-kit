"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // runs local dev server
var open = require('gulp-open'); // open a url in a web browser
var source = require('vinyl-source-stream') // uses conventional text streams with gulp
var browserify = require('browserify') // bundles JS
var reactify = require('reactify') // transforms react jsx to js
var concat = require('gulp-concat'); // concats files.
var lint = require('gulp-eslint'); // line js and jsx files.

var config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths: {
      html: './src/*.html',
      js: './src/**/*.js',
      css:
      [
        './src/css/*.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
      ],
      images: './src/images',
      dist: './dist',
      mainJs: './src/main.js',
      fonts: 'node_modules/bootstrap/dist/fonts/*'
  }
}

// Start a local development server
gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
  gulp.src(config.paths.html)
      .pipe(gulp.dest(config.paths.dist))
      .pipe(connect.reload());
});

gulp.task('css', function() {
  gulp.src(config.paths.css)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest(config.paths.dist + '/css'))
      .pipe(connect.reload());
});

gulp.task('fonts', function() {
  gulp.src(config.paths.fonts)
      .pipe(gulp.dest(config.paths.dist + '/fonts'))
});

gulp.task('js', function() {
  browserify(config.paths.mainJs)
      .transform(reactify)
      .bundle() // bundles all js files into one
      .on('error', console.error.bind(console)) // any erros should get propgagted to the console
      .pipe(source('bundle.js')) // name the bundled js file
      .pipe(gulp.dest(config.paths.dist + '/scripts'))
      .pipe(connect.reload()); // any js changed will result in automatic reload of the web server
});

gulp.task('lint', function() {
  return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .pipe(lint.format());
});

gulp.task('images', function() {
  gulp.src(config.paths.images)
      .pipe(gulp.dest(config.paths.dist + '/images'))
      .pipe(connect.reload());
})

gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js', 'lint']);
  gulp.watch(config.paths.css, ['css']);
});

gulp.task('default', ['html', 'js', 'fonts', 'css', 'images', 'lint', 'open', 'watch']);

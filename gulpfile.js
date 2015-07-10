'use strict';
var config = require('./config');

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify =  require('gulp-uglify');

var log  = require('gulp-util').log;

var server  = require('tiny-lr');
var refresh = require('gulp-livereload');

var del = require('del');

var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload');

var notifier = require('node-notifier');


//Config the server to be started
var server = express();
server.use(livereload({port: config.ports.livereload}));
server.use(express.static('./dist'));

// Dev task
gulp.task('dev', ['clean', 'static-resources', 'styles', 'lint', 'browserify' ], function() { });


// Clean task
gulp.task('clean', function() {
  return del.sync(['dist/templates']);
});

// JSHint task
gulp.task('lint', function() {
  return gulp.src('app/scripts/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});


// Styles task
gulp.task('styles', function() {
  return gulp.src('app/style/main.scss')
  .pipe(sass({onError: function(e) {
    notifier.notify({
      'title': 'SASS error',
      'message': e.message
    });
    }
  })


    ) // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8')) // Optionally add autoprefixer
  .pipe(gulp.dest('dist/style/'));
});


// Browserify task
gulp.task('browserify', function() {
  return gulp.src(['./app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .on('error', function(err){
    console.log(err);

    notifier.notify({
      'title': 'Javascript error',
      'message': err.message
    });

  })
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./dist/scripts'))
  .pipe(refresh(config.ports.livereload));
});


// Static Resources task
gulp.task('static-resources', function() {
  return gulp.src(['app/**/*','!app/scripts/**','!app/style/**'])
  .pipe(gulp.dest('dist/'))
  .pipe(refresh(config.ports.livereload));
});


// Watch task
gulp.task('watch', ['clean', 'static-resources', 'styles', 'lint', 'browserify'], function() {

  server.listen(config.ports.server);
  refresh.listen(config.ports.livereload);

  gulp.watch(['app/scripts/*.js'],['lint','browserify']); // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['app/style/**/*.scss'], ['styles']); // Watch our sass files
  gulp.watch(['app/**/*'], ['static-resources']);

  gulp.watch('./dist/**').on('change', refresh.changed);
});


// Default task
gulp.task('default', ['dev', 'watch']);

require('./gulp-upload');

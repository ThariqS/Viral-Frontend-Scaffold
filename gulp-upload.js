var config = require('./config');
var gulp = require('gulp');

var awspublish  = require('gulp-awspublish');
var publisher   = awspublish.create(config.aws);

gulp.task("publish", function() {
  return gulp.src('./dist/**')
    .pipe(publisher.publish())
    .pipe(awspublish.reporter());

});

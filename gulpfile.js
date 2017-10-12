var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var mocha = require('gulp-mocha');
var debug = require('gulp-debug');
var dtsm = require('gulp-dtsm');
var concat = require('gulp-concat');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('tslint', function () {
  return gulp.src('src/**/*.ts')
  .pipe(debug())
  .pipe(tslint())
  .pipe(tslint.report('prose'));
});
gulp.task('ts', ['dtsm'], function () {
  return tsProject.src()
  .pipe(tsProject()).js
  .pipe(concat('index.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  return gulp.watch('./src/main.ts', ['ts']);
});

gulp.task('test', ['dtsm', 'ts'], function () {
  return gulp.src(['./typings/**/*.d.ts', './test/index.ts'])
  .pipe(debug())
  .pipe(ts({
    module: 'umd'
  })).js
  .pipe(gulp.dest('./test'))
  .pipe(debug())
  .pipe(mocha({
    reporter: 'spec'
  }));
});

gulp.task('dtsm', function () {
  return gulp.src('./dtsm.json')
  .pipe(dtsm());
});

gulp.task('build-and-test', ['dtsm', 'ts', 'test']);

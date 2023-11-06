const gulp = require('gulp');
const zip = require('gulp-zip');
const path = require('path');

const libraryName = 'docvieweditor-library';

// Zip task
gulp.task('zip', function () {
  return gulp
    .src(['./dist/**/*'], { base: './dist' })
    .pipe(zip(libraryName + '.zip'))
    .pipe(gulp.dest('./'));
});

// Install task
gulp.task('install', gulp.series('zip', function () {
  const destPath = path.join(__dirname, '..', '..', 'Angular-HelloWorld-main');
  const zipFilePath = path.join(__dirname, libraryName + '.zip');

  return gulp
    .src(zipFilePath)
    .pipe(gulp.dest(destPath));
}));

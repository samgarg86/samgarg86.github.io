var gulp = require('gulp');
var sass = require('gulp-sass');

var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');

var input = './css/scss/**/*.scss';
var output = './css/';

var inputResume = './resume/css/scss/**/*.scss';
var outputResume = './resume/css/';


gulp.task('css-main', function() {
	return gulp
		.src(input)
		.pipe(sass().on('error', sass.logError))
        // .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            browsers: ['> 5%']
        }))
        .pipe(cssnano({ mergeRules: false }))
		.pipe(gulp.dest(output));
});

gulp.task('css-resume', function() {
    return gulp
        .src(inputResume)
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(autoprefixer({
            browsers: ['> 5%']
        }))
        // .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(outputResume));
});

//Watch Resume
gulp.task('css-resume-watch', ['css-resume'], function() {
    // watch for any changes
    return gulp.watch(inputResume,['css-resume']);
});

//Watch Main
gulp.task('css-main-watch', ['css-main'], function() {
    // watch for any changes
    return gulp.watch(input,['css-main']);
});

//Watch task
gulp.task('default', ['css-main'], function() {
	// watch for any changes
	return gulp.watch(input,['css-main']);
});


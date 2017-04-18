var gulp = require('gulp');

var sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename');

//编译sass为 css
gulp.task('sass',function(){
    return gulp.src('content/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('content/css/'));
});

//压缩js为min.js
gulp.task('jsmin', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
            //preserveComments: 'all' //保留所有注释
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/js'));
});

//压缩css
gulp.task('cssmin',['sass'],function () {
    gulp.src('content/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css'));
});

//监视任务的变化
gulp.task('watch',function() {
    gulp.watch('src/js/*.js',['jsmin']);
  //  gulp.wath('src/html/*.html',['html']);
   // gulp.wath('src/lib/*.js',['js']);
});

//默认的任务
gulp.task('default',['sass','jsmin','cssmin']);
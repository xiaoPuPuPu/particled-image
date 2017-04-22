var gulp = require('gulp');

var sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel');


//编译sass为 css
gulp.task('sass',function(){
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css/'));
});

//压缩js为min.js
gulp.task('jsmin',['es2015'], function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
            //preserveComments: 'all' //保留所有注释
        }))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});


//压缩css
gulp.task('cssmin',['sass'],function () {
    return gulp.src('src/css/*.css')  //使用 return 返回一个 stream 保证异步执行
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

//监视任务的变化
gulp.task('watch',function() {
    //gulp.watch('src/js/*.js',['jsmin']);
    gulp.watch('src/html/*.html',['html']);
    gulp.watch('src/js/*.js',['es2015']);
    gulp.watch('src/images/*',['imagemin']);
    gulp.watch(['content/sass/*.scss','src/js/*.js','src/html/*.html'],['sass']);
});

//定义livereload任务
gulp.task('connect',function () {
    connect.server({
        root:['src'],
        livereload: true,
        port:10086,

    });
});

//html 使用
gulp.task('html',function () {
    gulp.src('src/html/*.html')
        .pipe(gulp.dest('dist/html'))
        .pipe(connect.reload());;
});

//压缩图片
gulp.task('imagemin',function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dest/images'))
});

//es6
gulp.task('es2015',function () {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['babel-preset-es2015']
        }))
        .pipe(gulp.dest('src/js/'))
});

//开发任务
gulp.task('do',['sass','imagemin','es2015','connect','watch']);


//默认的任务
gulp.task('default',['html','sass','jsmin','imagemin','cssmin','connect','watch']); //[a1,a2] 顺序有关

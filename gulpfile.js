var gulp = require('gulp');

var sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

gulp.task('sass',function(){
    return gulp.src('content/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('content/css/'));
});
gulp.task('jsmin', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
            //preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('watch',function() {
    gulp.watch('src/js/*.js',['jsmin']);
  //  gulp.wath('src/html/*.html',['html']);
   // gulp.wath('src/lib/*.js',['js']);
});
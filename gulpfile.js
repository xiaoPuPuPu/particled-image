//


var gulp = require('gulp');

var sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    gulpif = require('gulp-if'),
	minimist = require('minimist'), //轻量级参数取得
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel'),
	clean = require('gulp-clean'),//清理文件
	autoprefixer = require('gulp-autoprefixer'),//css兼容性前缀
    cache = require('gulp-cache'),  //保持缓存，只压缩改变的图片
    rev = require('gulp-rev'),  //版本生成
	revCollector = require('gulp-rev-collector'),  //版本放入 .html中
    stripDebug = require('gulp-strip-debug'); //去处console.log()
/**
 * process.argv
 *返回当前命令行指令参数 ，
 *但不包括node特殊(node-specific) 的命令行选项（参数）。
 *常规第一个元素会是 'node'，
 *第二个元素将是 .Js 文件的名称。
 *接下来的元素依次是命令行传入的参数：
 *
 * **/
var options = minimist(process.argv.slice(2)); //得到命中参数的解析


//编译sass为 css
gulp.task('sass',['cleanCss'],function(){
    //当输入命令 gulp -p -5  dsfds87832

	console.log(process.argv);/*[ 'D:\\Program Files\\nodejs\\node.exe',
	                              'C:\\Users\\hero\\AppData\\Roaming\\npm\\node_modules\\gulp\\bin\\gulp.js',
		                          '-p',
		                          '-5',
		                          'dsfds87832'
		                      ]*/

	console.log(options);/*
	                      { '5': 'dsfds87832',
	                        p: true
	                     }
	                   */
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(rev())
		//.pipe(clean())
        .pipe(gulp.dest('build/css/'))
        .pipe(rev.manifest())//生成一个rev-mainfest.json
		.pipe(gulp.dest('rev/'));

});
gulp.task('cleanCss', function () {
	return gulp.src('build/**/*.css', {read: false})
		.pipe(clean());
});

gulp.task('cleanJs', function () {
	return gulp.src('build/**/*.js', {read: false})
		.pipe(clean());
});


//
gulp.task('rev',['html','sass'],function() {
	gulp.src(['rev/*.json','src/index.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('build/'))
});

//压缩js为min.js
gulp.task('jsmin',['es2015'], function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
		.pipe(gulpif(options.p,stripDebug()))
        .pipe(gulpif(options.p,uglify({ //有参数p才压缩
			mangle: true,//类型：Boolean 默认：true 是否修改变量名
			compress: true,//类型：Boolean 默认：true 是否完全压缩
			mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
			//preserveComments: 'all' //保留所有注释
		})))
        .pipe(gulpif(options.p,rename({suffix:'.min'})))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
});


//压缩css
gulp.task('cssmin',['sass'],function () {
    return gulp.src('build/css/*.css')  //使用 return 返回一个 stream 保证异步执行
        .pipe(cssmin())
        .pipe(clean())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
});

//监视任务的变化
gulp.task('watch',function() {
    gulp.watch('src/html/*.html',['html']);
    gulp.watch('src/js/es6_style/*.js',['es2015','jsmin']);
    gulp.watch('src/images/*',['imagemin']);
    gulp.watch('src/sass/*.scss',['sass']);
});

//定义livereload任务
gulp.task('connect',function () {
    connect.server({
        root:['build'],
        livereload: true,
        port:10086,

    });
});

//html 使用
gulp.task('html',function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

//压缩图片
gulp.task('imagemin',function () {
    return gulp.src('src/images/*')
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest('build/images'))
});

//es6
gulp.task('es2015',['cleanJs'],function () {
    return gulp.src('src/js/es6_style/*.js')
        .pipe(babel({
            presets: ['babel-preset-es2015']
        }))
        .pipe(gulp.dest('src/js/'))
});

//开发任务
gulp.task('default',['html','sass','jsmin','imagemin','es2015','connect','rev','watch']);


//生产任务
gulp.task('do',['html','sass','jsmin','imagemin','cssmin','connect','watch']); //[a1,a2] 顺序有关

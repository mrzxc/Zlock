var gulp = require("gulp"),
    Browsersync = require("browser-sync").create(),
    reload = Browsersync.reload;
gulpLoadPlugins = require("gulp-load-plugins")
var $ = gulpLoadPlugins();
gulp.task("es6", function() {
    return gulp.src('./src/lock.js')
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./lib'))
        .pipe(reload({stream: true}))
})
gulp.task("build", function() {
    return gulp.src("./lib/*.js")
        .pipe($.uglify())
        .pipe(gulp.dest("./lib"));
})
gulp.task("build-css", function() {
    return gulp.src("./test/style/css/*.css")
        .pipe($.uglify())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./test/style/css'))
})
gulp.task('less', function() {
    return gulp.src('./test/style/less/*.less')
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./test/style/css'))
        .pipe(reload({stream: true}))
});
gulp.task("server", ["es6", "less"], function() {
    Browsersync.init({
        server: {
           baseDir: "./"
        }
    })
    gulp.watch("./test/demo.html", reload);
    gulp.watch("./test/style/less/{demo,mixin}.less", ['less']);
    gulp.watch("./src/lock.js", ['es6']);
})
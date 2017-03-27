var gulp = require("gulp"),
    Browsersync = require("browser-sync").create(),
    reload = Browsersync.reload;
gulpLoadPlugins = require("gulp-load-plugins")
var $ = gulpLoadPlugins();
gulp.task("es6", function() {
    return gulp.src('./src/*.js')
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./lib'))
})
gulp.task("js", function() {
    return gulp.src("./lib/*.js")
        .pipe(reload({ stream: true }));
})
gulp.task("css", function() {
    return gulp.src("./style/css/*.css")
        .pipe(reload({ stream: true }));
})
gulp.task('less', function() {
    return gulp.src('./style/less/*.less')
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./style/css'));
});
gulp.task("server", ["es6", "js", "less", "css"], function() {
    Browsersync.init({
        server: {
            baseDir: "./"
        }
    })
    gulp.watch("./*.html", reload);
    gulp.watch("./style/less/*.less", ['less']);
    gulp.watch("./style/css/*.css").on("change", reload);
    gulp.watch("./src/*.js", ['es6']);
    gulp.watch("./lib/*.js").on("change", reload);
})
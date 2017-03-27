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
})
gulp.task("js", function() {
    return gulp.src(["./lib/lock.js", "./tests/demo.js"])
        .pipe(reload({ stream: true }));
})
gulp.task("css", function() {
    return gulp.src("./tests/style/css/{demo,mixin}.css")
        .pipe(reload({ stream: true }));
})
gulp.task('less', function() {
    return gulp.src('./tests/style/less/{demo,mixin}.less')
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./tests/style/css'));
});
gulp.task("server", ["es6", "js", "less", "css"], function() {
    Browsersync.init({
        server: {
            baseDir: "./"
        }
    })
    gulp.watch("./tests/demo.html", reload);
    gulp.watch("./tests/style/less/{demo,mixin}.less", ['less']);
    gulp.watch("./tests/style/less/{demo,mixin}.css").on("change", reload);
    gulp.watch("./src/lock.js", ['es6']);
    gulp.watch("./lib/lock.js").on("change", reload);
})
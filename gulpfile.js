const gulp = require("gulp");
const sass = require("gulp-sass");
const nodemon = require("gulp-nodemon");
const start = require("gulp-start-process");
const eslint = require("gulp-eslint");

gulp.task("lint", () => {
    let src = ["**/*.js"];

    return gulp.src(src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("sass", function() {
    return gulp.src("content/scss/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("content/css/"));
});

gulp.task("server", () => {
    return nodemon({
        script: "app.js",
        watch: [
            "app.js", 
            "api/**/*.js"
        ]
    });
});

gulp.task("au-run", (cb) => {
    start("au run", {}, cb);
});

gulp.task("au-build", (cb) => {
    start("au build", {}, cb);
});

gulp.task("watch-sass", () => {
    gulp.watch("content/scss/**/*.scss", gulp.series("sass"));
});

gulp.task("build", gulp.parallel("sass", "au-build"));

gulp.task("default", gulp.parallel("server", "sass", "watch-sass", "au-run"));
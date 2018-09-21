const gulp = require("gulp");
const sass = require("gulp-sass");
const nodemon = require("gulp-nodemon");
const start = require("gulp-start-process");

gulp.task("start-au-cli", (cb) => {
    start("au run", {}, cb);
});

gulp.task("sass", function() {
    return gulp.src("content/scss/**/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("content/css/"));
});

gulp.task("watch-sass", () => {
    gulp.watch("content/scss/**/*.scss", gulp.series("sass"));
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

gulp.task("default", gulp.parallel("server", "sass", "watch-sass", "start-au-cli", () => {}));
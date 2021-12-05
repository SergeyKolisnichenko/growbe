const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanСss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const server = require("browser-sync");
const htmlMin = require("gulp-htmlmin");
const imageMin = require("gulp-imagemin");

gulp.task("server", function () {
  server({
    server: {
      baseDir: "dist",
    },
  });
  gulp.watch("src/*.html").on("change", server.reload);
  gulp.watch("src/js/**/*.js").on("change", server.reload);
});

gulp.task("styles", function () {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(
      rename({
        prefix: "",
        suffix: ".min",
      })
    )
    .pipe(autoprefixer())
    .pipe(
      cleanСss({
        compatibility: "ie8",
      })
    )
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("html", function () {
  return gulp
    .src("src/*.html")
    .pipe(
      htmlMin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("fonts", function () {
  return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

gulp.task("js", function () {
  return gulp.src("src/js/**/*.js").pipe(gulp.dest("dist/js"));
});

gulp.task("icons", function () {
  return gulp.src("src/icons/**/*").pipe(gulp.dest("dist/icons"));
});

gulp.task("img", function () {
  return gulp.src("src/img/**/*").pipe(imageMin()).pipe(gulp.dest("dist/img"));
});

gulp.task("watch", function () {
  gulp.watch("src/scss/**/*.scss", gulp.parallel("styles"));
  gulp.watch("src/js/**/*.js", gulp.parallel("js"));
  gulp.watch("src/fonts/**/*", gulp.parallel("fonts"));
  gulp.watch("src/icons/**/*", gulp.parallel("icons"));
  gulp.watch("src/img/**/*", gulp.parallel("img"));
  gulp.watch("src/*.html").on("change", gulp.parallel("html"));
});

gulp.task(
  "default",
  gulp.parallel(
    "server",
    "styles",
    "html",
    "js",
    "img",
    "icons",
    "fonts",
    "watch"
  )
);

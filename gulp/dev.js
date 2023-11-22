import gulp from "gulp";
// html
import fileInclude from "gulp-file-include";
// scss and css
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import sassGlob from "gulp-sass-glob";
import sourceMaps from "gulp-sourcemaps";
// livesver
import server from "gulp-server-livereload";
// remove primary folder assemblies
import clean from "gulp-clean";
import fs from "fs";
// non stop building and error
import plamber from "gulp-plumber";
import notify from "gulp-notify";
// js
import webpack from "webpack-stream";
import webpackConfig from "../webpack.config.js";

// import babel from "gulp-babel";
// import imagemin from "gulp-imagemin";

// tracking for files on change
import changed from "gulp-changed";

const plamberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= error.message %>",
      sound: false,
    }),
  };
};

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html:dev", function () {
  return (
    gulp
      .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
      // .pipe(changed("./build")) // При передачен параметра {hasChanged: changed.compareContents}, выходит ошибка
      .pipe(plamber(plamberNotify("HTML")))
      .pipe(fileInclude(fileIncludeSettings))
      .pipe(gulp.dest("./build"))
  );
});

gulp.task("sass:dev", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./build/css"))
    .pipe(plamber(plamberNotify("SASS")))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./build/css"));
});

gulp.task("images:dev", function () {
  return (
    gulp
      .src("./src/img/**/*")
      .pipe(changed("./build/img/"))
      // .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./build/img"))
  );
});

gulp.task("fonts:dev", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts"))
    .pipe(gulp.dest("./build/fonts"));
});

gulp.task("files:dev", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files"))
    .pipe(gulp.dest("./build/files"));
});

gulp.task("js:dev", function () {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./build/js"))
      .pipe(plamber(plamberNotify("JS")))
      // .pipe(babel())
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest("./build/js"))
  );
});

const serverSettings = {
  livereload: true,
  open: true,
};

gulp.task("server:dev", function () {
  return gulp.src("./build").pipe(server(serverSettings));
});

gulp.task("clean:dev", function (done) {
  if (fs.existsSync("./build")) {
    return gulp.src("./build", { read: false }).pipe(clean({ force: true }));
  } else {
    done();
  }
});

gulp.task("watch:dev", function () {
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("images:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
});

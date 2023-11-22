import gulp from "gulp";
// html
import fileInclude from "gulp-file-include";
import htmlclean from "gulp-htmlclean";
import webpHTML from "gulp-webp-html";
// scss and css
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import groupMedia from "gulp-group-css-media-queries";
import sassGlob from "gulp-sass-glob";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import webpCss from "gulp-webp-css";
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
import babel from "gulp-babel";
// images
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
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

gulp.task("html:docs", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./docs"))
    .pipe(plamber(plamberNotify("HTML")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest("./docs"));
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css"))
    .pipe(plamber(plamberNotify("SASS")))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(groupMedia())
    .pipe(webpCss())
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("images:docs", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(webp())
    .pipe(gulp.dest("./src/img"))
    .pipe(gulp.src("./src/img/**/*"))
    .pipe(changed("./docs/img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/img"));
});

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts"))
    .pipe(gulp.dest("./docs/fonts"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files"))
    .pipe(gulp.dest("./docs/files"));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js"))
    .pipe(plamber(plamberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest("./docs/js"));
});

const serverSettings = {
  livereload: true,
  open: true,
};

gulp.task("server:docs", function () {
  return gulp.src("./docs").pipe(server(serverSettings));
});

gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs")) {
    return gulp.src("./docs", { read: false }).pipe(clean({ force: true }));
  } else {
    done();
  }
});

// gulp.task("watch:docs", function () {
//   gulp.watch("./src/**/*.html", gulp.parallel("html:docs"));
//   gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:docs"));
//   gulp.watch("./src/img/**/*", gulp.parallel("images:docs"));
//   gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:docs"));
//   gulp.watch("./src/files/**/*", gulp.parallel("files:docs"));
//   gulp.watch("./src/js/**/*.js", gulp.parallel("js:docs"));
// });

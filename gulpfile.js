const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const csso = require('postcss-csso');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('autoprefixer');
const del = require('del');
const sync = require('browser-sync').create();

const styles = () => {
  return gulp.src('source/scss/styles.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write('.'))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(sync.stream());
}

exports.styles = styles;

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist'))
}

exports.html = html;

const images = () => {
  return gulp.src('source/images/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest('dist/images'))
}

exports.images = images;

const createWebp = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
  .pipe(webp({quality: 80}))
  .pipe(gulp.dest('dist/images'))
}

exports.createWebp = createWebp;

const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/images/**/*.{jpg,png,svg}'
  ],
  {
    base: 'source'
  })
  .pipe(gulp.dest('dist'));
}

exports.copy = copy;

const clean = () => {
  return del('dist');
}

exports.clean = clean;

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'dist'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const dist = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    images,
    createWebp
  )
)

exports.dist = dist;

const reload = done => {
  sync.reload();
  done();
}

const watcher = () => {
  gulp.watch("source/scss/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    createWebp
  ),
  gulp.series(
    server, watcher
  )
);
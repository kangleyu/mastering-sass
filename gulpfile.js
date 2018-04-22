'use strict';

const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const sourcemaps = require('gulp-sourcemaps');
const sync = require('browser-sync').create();

const pathto = {
  "scss": path.join(__dirname, '/assets/scss'),
  "css": path.join(__dirname, '/assets/css')
};
const glob = {
  "sass": path.join(pathto.scss, '**/*.{scss,sass}')
};

gulp.task('log', () => {
  console.log(pathto.scss);
  console.log(pathto.css);
  console.log(glob.sass);
});

/**
 * Default Task
 * 
 * Runs `gulp serve`
 */
gulp.task('default', ['serve']);

// compile for sass files into css files
gulp.task('sass:compile', () => {
  /**
   * Compile Sass and generate sourcemaps
   * @param glob.sass Glob pattern we defined above
   * @param options for gulp-ruby-sass
   */
  return sass(glob.sass, {
    style: 'expanded',
    lineNumbers: true,
    sourcemap: true
  })
  // Generate sourcemaps using gulp-sourcemaps
  .pipe(sourcemaps.write('.'))
  // output the files to css
  .pipe(gulp.dest(pathto.css))
  // to use browser sync it needs to process the stream AFTER gulp.dest
  // to work properly with sourcemaps we need to only
  // watch CSS fiels and not .css.map files
  .pipe(sync.stream({match: pathto.css + '/*.css'}));
});

// watch for sass files and do compile automatically
gulp.task('sass:watch', () => {
  gulp.watch(glob.sass, ['sass:compile']);
});

// create a server at http://localhost:3000
gulp.task('serve', ['log'], () => {
  // set up the options for the server
  sync.init({
    server: {
      // set the root of your server relative to this file (gulpfile.js)
      baseDir: './'
    }
  });

  // watch for changes and run any task we need
  gulp.watch(glob.sass, ['sass:compile']);
  // we can also manually run reload on files that aren't
  // in a gulp stream (fiels not processed by a gulp task)
  gulp.watch('./*.html').on('change', sync.reload);
})


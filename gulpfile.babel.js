const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');
const seq = require('run-sequence');

const paths = {
  client_code: ['client/**/*.+(js|jsx)'],
  vendor_code: ['client/vendor/**/*.+(js|jsx)'],
  client_html: ['client/**/*.html'],
  client_dest: '.pub',
  vendor_dest: '.pub/vendor',
  server_code: ['server/**/*.js'],
  server_json: ['server/**/*.json'],
  server_dest: '.srv'
};

// ************************************************************************** //
// ************************************************************************** //
// ************************************************************************** //

gulp.task('default', ['client-build', 'server-build', 'watch']);

gulp.task('watch', () => {
  gulp.watch([paths.client_code, paths.client_html], ['client-build']);
  gulp.watch(paths.server_code, ['server-build']);
});

// ************************************************************************** //
// ************************************************************************** //
// ************************************************************************** //

gulp.task('client-build', function(cb){
  seq('client-clean', 'client-babel', 'client-copy-html', 'client-copy-vendor', cb);
});

gulp.task('client-clean', () => {
  return del(paths.client_dest);
});

gulp.task('client-babel', shell.task([
  'webpack --progress --colors'
]));

gulp.task('client-copy-html', () => {
  gulp.src(paths.client_html)
    .pipe(gulp.dest(paths.client_dest));
});

gulp.task('client-copy-vendor', () => {
  gulp.src(paths.vendor_code)
    .pipe(gulp.dest(paths.vendor_dest));
});

// ************************************************************************** //
// ************************************************************************** //
// ************************************************************************** //

gulp.task('server-build', function(cb){
  seq('server-clean', 'server-babel', 'server-copy-json', cb);
});

gulp.task('server-clean', () => {
  return del(paths.server_dest);
});

gulp.task('server-babel', shell.task([
  'npm run build'
]));

gulp.task('server-copy-json', () => {
  gulp.src(paths.server_json)
    .pipe(gulp.dest(paths.server_dest));
});

// ************************************************************************** //
// ************************************************************************** //
// ************************************************************************** //

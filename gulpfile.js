var autoprefixer, browserSync, concat, config, gulp, imagemin, minify, path, plumber, rename, sass, streamqueue, uglify,changed;

gulp = require('gulp');
sass = require('gulp-sass');
plumber = require('gulp-plumber');
rename = require('gulp-rename');
autoprefixer = require('gulp-autoprefixer');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
imagemin = require('gulp-imagemin');
minify = require('gulp-clean-css');
streamqueue = require('streamqueue');
browserSync = require('browser-sync');
changed = require('gulp-changed');

config = {
	srcDir: './src/'
};

var path = {
	styles: [
		config.srcDir + 'styles/theme.css',
		config.srcDir + 'plugins/bootstrap-4.0.0/dist/css/bootstrap.css',
		config.srcDir + 'fonts/font-awesome/css/font-awesome.css',
		config.srcDir + 'styles/style.css',
		config.srcDir + 'styles/media.css',
	],
	scripts: [
		config.srcDir + 'scripts/jquery.min.js',
		config.srcDir + 'plugins/bootstrap-4.0.0/dist/js/popper.min.js',
		config.srcDir + 'plugins/bootstrap-4.0.0/dist/js/bootstrap.js',
		config.srcDir + 'scripts/setting.js'
	],
	fonts: [
		config.srcDir + 'fonts/font-awesome/fonts/*.*',
		config.srcDir + 'fonts/**/*.*',
	],
	images: 'src/images/**/*.*',
	php: ['*.php']
};

gulp.task('styles', function() {
	var stream;
	stream = streamqueue({objectMode: true});
	stream.queue(gulp.src(path.styles));
	return stream.done()
					.pipe(plumber())
					.pipe(sass())
					.pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
					.pipe(concat('style.css'))
					.pipe(gulp.dest('vendors/styles/'))
					.pipe(minify({keepSpecialComments: 0}))
					.pipe(rename({suffix: '.min'}))
					.pipe(plumber.stop()).pipe(gulp.dest('vendors/styles/')).pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	var stream;
	stream = streamqueue({objectMode: true});
	stream.queue(gulp.src(path.scripts));
	return stream.done()
					.pipe(plumber())
					.pipe(concat('script.js'))
					.pipe(gulp.dest('vendors/scripts/')).pipe(rename({suffix: '.min'}))
					.pipe(uglify())
					.pipe(plumber.stop())
					.pipe(gulp.dest('vendors/scripts/'))
					.pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function() {
	var stream;
	stream = streamqueue({objectMode: true});
	stream.queue(gulp.src(path.images));
	return stream.done()
					.pipe(changed('vendors/images/'))
					.pipe(imagemin({optimizationLevel: 3,progressive: true,interlaced: true}))
					.pipe(gulp.dest('vendors/images/'));
});

gulp.task('php', function() {
	var stream;
	stream = streamqueue({objectMode: true});
	stream.queue(gulp.src(path.php));
	return stream.done()
					.pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function() {
	var stream;
	stream = streamqueue({objectMode: true});
	stream.queue(gulp.src(path.fonts));
	return stream.done()
					.pipe(gulp.dest('vendors/fonts/'));
});

gulp.task('connect-sync', ['styles', 'scripts', 'php'], function() {
	browserSync.init({
		proxy: 'localhost/deskapp',
		open: true,
		reloadDelay: 50,
		watchOptions: {
			debounceDelay: 50
		}
	});
	gulp.watch(['src/styles/**/**'], ['styles']);
	gulp.watch(['src/scripts/**/**'], ['scripts']);
	gulp.watch(path.php, ['php']);
	return gulp.watch(['*', 'vendors/**/**'], function(file) {
		if (file.type === "changed") {
			return browserSync.reload(file.path);
		}
	});
});

gulp.task('watch', function(){
	gulp.watch("src/styles/**/*.*", ['styles']);
	gulp.watch("src/fonts/**/*", ['fonts']);
	gulp.watch("src/scripts/**/*.js", ['scripts']);
	//gulp.watch(path.images, ['images']);
});

gulp.task('default', ['styles', 'fonts', 'scripts', 'connect-sync'], function(){
	gulp.watch("src/styles/**/*.*", ['styles']);
	gulp.watch("src/fonts/**/*", ['fonts']);
	gulp.watch("src/scripts/**/*.js", ['scripts']);
	//gulp.watch(path.images, ['images']);
});
"use strict";

/* options for gulp-autoprefixer */
const autoprefixerList = [
    'Chrome >= 100',
    'Firefox ESR',
    'Edge >= 16',
    'Explorer >= 11',
    'iOS >= 9',
    'Safari >= 9',
    'Android >= 4.4',
    'Opera >= 50'
];
/* paths to source files (src), to ready-made files (build), as well as to those whose changes need to be monitored (watch) */
const paths = {
    build: {
        html:  'assets/build/',
        js:    'assets/build/js/',
        css:   'assets/build/css/',
        img:   'assets/build/img/',
        fonts: 'assets/build/fonts/',
        json: 'assets/build/json/',
        partials: 'assets/build/partials/',
    },
    src: {
        html:  'assets/src/**/*.html',
        js:    'assets/src/js/common.js',
        jsSvg:    'assets/src/js/svg.js',
        style: 'assets/src/style/common.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*',
        json: 'assets/src/json/**/*.*',
        partials: 'assets/src/partials/',
        svgSrc: 'assets/src/svg/src/icons/**/*.*',
        svgDist: 'assets/src/svg/dist/icons/',
        buildFiles: 'assets/build/**',
        build: 'assets/build/',
    },
    watch: {
        html:  'assets/src/**/*.html',
        js:    'assets/src/js/**/*.js',
        css:   'assets/src/style/**/*.scss',
        img:   'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*',
        json: 'assets/srs/json/**/*.json',
    },
    clean:     './assets/build'
};

/* server settings */
const config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* including gulp and plugins */
const gulp = require('gulp'),  // connect Gulp
    webserver = require('browser-sync'), // server to work and automatically update pages
    plumber = require('gulp-plumber'), // bug tracking module
    rigger = require('gulp-rigger'), // to import the contents of one file to another
    sourcemaps = require('gulp-sourcemaps'), // for generating a source file map
    sass = require('gulp-sass')(require('sass')), // for compiling SASS (SCSS) to CSS
    autoprefixer = require('gulp-autoprefixer'), // for automatic placement of auto prefixes
    cleanCSS = require('gulp-clean-css'), // plugin to minimize CSS
    uglify = require('gulp-uglify-es').default, // to minimize JavaScript
    cache = require('gulp-cache'), // for caching
    imagemin = require('gulp-imagemin'), // plugin to compress PNG, JPEG, GIF and SVG images
    jpegrecompress = require('imagemin-jpeg-recompress'), // jpeg compression plugin
    pngquant = require('imagemin-pngquant'), // png compression plugin
    del = require('del'), // plugin for deleting files and directories
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    htmlPartial = require('gulp-html-partial'),
    path = require('path'),

    // SVG
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    svg2string = require('gulp-svg2string'),

    //miniy HTML
    htmlmin = require('gulp-htmlmin');

/* tasks */

// server startup
gulp.task('webserver', function (done) {
    webserver(config);
    done();
});

// build html
//develop version
gulp.task('html:build-dev', function (done) {
    gulp.src(paths.src.html) // selection of all html files in the specified path
        .pipe(plumber()) // errors tracking
        .pipe(htmlPartial({
            basePath: paths.src.partials // import "<partial src="..."></partial>" partials
        }))
        .pipe(rigger()) // import "//=" partials
        .pipe(gulp.dest(paths.build.html)) // laying out ready files
        .pipe(webserver.reload({stream: true})); // server reboot
    done();
});

//production version
gulp.task('html:build-prod', function (done) {
    gulp.src(paths.src.html) // selection of all html files in the specified path
        .pipe(plumber()) // errors tracking
        .pipe(htmlPartial({
            basePath: paths.src.partials // import "<partial src="..."></partial>" partials
        }))
        .pipe(rigger()) // import "//=" partials
        .pipe(replace('css/common.min.css', 'css/common.min.css'))//specify the path depending on the nesting on the server
        .pipe(replace('js/common.min.js', 'js/common.min.js'))//specify the path depending on the nesting on the server
        .pipe(replace('img/favicon/', 'img/favicon/'))//specify the path depending on the nesting on the server
        .pipe(htmlmin({ // https://github.com/kangax/html-minifier#options-quick-reference
            collapseWhitespace: true, // Collapse white space that contributes to text nodes in a document tree
            minifyCSS: true, // Minify CSS in style elements and style attributes (uses clean-css)
            minifyJS: true, // Minify JavaScript in script elements and event attributes (uses UglifyJS)
            collapseInlineTagWhitespace: true, // Don't leave any spaces between display:inline; elements when collapsing. Must be used in conjunction with collapseWhitespace=true
            decodeEntities: true, // Use direct Unicode characters whenever possible
            processConditionalComments: true // Process contents of conditional comments through minifier
        }))
        .pipe(gulp.dest(paths.build.html)) // laying out ready files
        .pipe(webserver.reload({stream: true})); // server reboot
    done();
});

// build styles
//develop version
gulp.task('css:build-dev', function (done) {
    gulp.src(paths.src.style) // get common.scss
        .pipe(plumber()) // errors tracking
        .pipe(sourcemaps.init()) // initialize sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer({
            overrideBrowserslist: autoprefixerList
        }))
        .pipe(gulp.dest(paths.build.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS()) // minimizing CSS
        .pipe(sourcemaps.write('./')) // write sourcemap
        .pipe(gulp.dest(paths.build.css)) // upload to build
        .pipe(webserver.reload({stream: true})); // reboot the server
    done();
});

//production version
gulp.task('css:build-prod', function (done) {
    gulp.src(paths.src.style) // get common.scss
        .pipe(plumber()) // errors tracking
        .pipe(sass()) // scss -> css
        .pipe(replace('/img/', '/img/'))//specify the path depending on the nesting on the server
        .pipe(autoprefixer({
            overrideBrowserslist: autoprefixerList
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS()) // minimizing CSS
        .pipe(gulp.dest(paths.build.css)) // upload to build
        .pipe(webserver.reload({stream: true})); // reboot the server
    done();
});

// build js
//develop version
gulp.task('js:build-dev', function (done) {
    gulp.src(paths.src.js) // get the common.js file
        .pipe(plumber()) // to track errors
        .pipe(rigger()) // import all specified files into common.js
        .pipe(gulp.dest(paths.build.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init()) // initialize sourcemap
        .pipe(uglify()) // minimizing js
        .pipe(sourcemaps.write('./')) //  write sourcemap
        .pipe(gulp.dest(paths.build.js)) // put in the finished file
        .pipe(webserver.reload({stream: true})); // reboot the server
    done();
});

//production version
gulp.task('js:build-prod', function (done) {
    gulp.src(paths.src.js) // get the common.js file
        .pipe(plumber()) // to track errors
        .pipe(rigger()) // import all specified files into common.js
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify()) // minimizing js
        .pipe(gulp.dest(paths.build.js)) // put in the finished file
        .pipe(webserver.reload({stream: true})); // reboot the server
    done();
});

// copy fonts
gulp.task('fonts:build', function(done) {
    gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts));
    done();
});

// copy json files
gulp.task('json:build', function(done) {
    gulp.src(paths.src.json)
        .pipe(gulp.dest(paths.build.json));
    done();
});

// image processing
gulp.task('image:build', function (done) {
    gulp.src(paths.src.img) // source image path
        .pipe(cache(imagemin([ // image compression
            imagemin.gifsicle({interlaced: true}),
            jpegrecompress({
                progressive: true,
                max: 90,                min: 80
            }),
            pngquant(),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
        ])))
        .pipe(gulp.dest(paths.build.img)); // uploading finished files
    done();
});


// delete build directory
gulp.task('clean:build', function (done) {
    del.sync(paths.clean);
    done();
});

// clear cache
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// running tasks when files change
gulp.task('watch', function() {
    gulp.watch(paths.watch.html, gulp.series('html:build-dev'));
    gulp.watch(paths.watch.css, gulp.series('css:build-dev'));
    gulp.watch(paths.watch.js, gulp.series('js:build-dev'));
    gulp.watch(paths.watch.img, gulp.series('image:build'));
    gulp.watch(paths.watch.fonts, gulp.series('fonts:build'));
    gulp.watch(paths.watch.json, gulp.series('json:build'));
});

// build production
gulp.task('build', gulp.series(
    'clean:build',
    'html:build-prod',
    'css:build-prod',
    'js:build-prod',
    'fonts:build',
    'json:build',
    'image:build'
));
// delete build directory
gulp.task('del:partials', function (done) {
    del.sync(paths.build.partials);
    done();
});

gulp.task('svg-make', function (done) {

    del.sync(paths.src.svgDist);

    gulp
        .src(paths.src.svgSrc)
        .pipe(svgmin(function getOptions (file) {
            var prefix = path.posix.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    //list of plugins https://github.com/svg/svgo/tree/master/plugins
                    //adding unique id
                    {
                        name: 'cleanupIDs',
                        params: {
                            prefix: prefix + '-',
                            minify: true
                        }
                    },
                    'removeViewBox',
                    'removeDimensions'
                ]
            }
        }))
        .pipe(gulp.dest(paths.src.svgDist))
        .pipe(svgstore())
        .pipe(svg2string())
        .pipe(rename(paths.src.jsSvg))
        .pipe(gulp.dest('./'));
    done();
});

// default task (develop)
gulp.task('default',
    gulp.series(
        'clean:build',
        'html:build-dev',
        'css:build-dev',
        'js:build-dev',
        'fonts:build',
        'json:build',
        'image:build',
        gulp.parallel(
            'webserver',
            'watch'
        )
    ));

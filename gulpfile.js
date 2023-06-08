const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const browsersync = require("browser-sync");
const concat = require("gulp-concat");
const cssnano = require("cssnano");
const data = require("gulp-data");
const del = require("del");
const fs = require("fs");
const { readFileSync } = require("fs");
const gulpif = require('gulp-if');
const htmlreplace = require("gulp-html-replace");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const nunjucksRender = require("gulp-nunjucks-render");
const postcss = require("gulp-postcss");
const prettyHtml = require("gulp-pretty-html");
const purgecss = require("gulp-purgecss");
const rename = require("gulp-rename");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const sass = require("gulp-dart-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

// Paths
const paths = {
  data: {
    src: "./src/data.json"
  },
  html: {
    src: "./src/*.html",
    pages: "./src/pages/**/*.+(html|njk|nunjucks)",
    templates: "./src/templates/**/*.+(html|njk|nunjucks)",
    dest: "./dist/*.html"
  },
  styles: {
    scss: "./src/scss/**/*.scss",
    css: "./src/css/",
    dest: "./dist/css/"
  },
  javascript: {
    src: ["./src/js/components/*.js","./src/js/features/*.js", "./src/js/vendors/*.js", "./src/js/main.js"],
    dest: "./dist/js/"
  },
  images: {
    src: "./src/img/**/*",
    dest: "./dist/img/"
  },
  fonts: {
    src: "./src/fonts/**/*",
    dest: "./dist/fonts/"
  },
  docs: {
    src: "./src/docs/**/*",
    dest: "./dist/docs/"
  },
  others: {
    src: "./src/site.webmanifest"
  }
};

// Browsersync serve
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  cb();
}

// Browsersync reload
function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Compile Nunjucks templates into HTML
function nunjucks() {
  return src(paths.html.pages)
    .pipe(
      data(() => {
        return JSON.parse(fs.readFileSync(paths.data.src));
      })
    )
    .pipe(
      nunjucksRender({
        path: ["./src/templates/"]
      })
    )
    .pipe(
      prettyHtml({
        indent_size: 2
      })
    )
    .pipe(dest("src"));
}

// Compile SCSS into CSS
function compileSCSS() {
  return src(paths.styles.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(paths.styles.css));
}

// Watch file changes
function watchChanges() {
  watch(paths.html.src, browsersyncReload);
  watch([paths.html.pages, paths.html.templates], nunjucks);
  watch(paths.data.src, series(nunjucks, browsersyncReload));
  watch(paths.styles.scss, series(compileSCSS, browsersyncReload));
  watch(paths.javascript.src, browsersyncReload);
}

// Minify CSS
function minifyCSS() {
  return src("./src/css/main.css")
    .pipe(
      purgecss({
        content: [paths.html.src],
        safelist: {
          standard: [/baguetteBox/, /dir-d/, /dir-u/, /iframe/, /is/],
          deep: [/baguetteBox/, /dir-d/, /dir-u/, /iframe/, /is/],
          greedy: [/baguetteBox/, /dir-d/, /dir-u/, /iframe/, /is/]
        }
      })
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(paths.styles.dest));
};

// Compile and minify JS
function minifyJS() {
  return src(paths.javascript.src)
    .pipe(sourcemaps.init())
    .pipe(gulpif('!*.min.js',
      babel({ 
        presets: ["@babel/env"]
      }))) 
    .pipe(gulpif('!*.min.js',
      uglify({
        output: {
          comments: /^!/
        }
      })))
    .pipe(concat("main.js"))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(paths.javascript.dest));
};

// Compress images
function compressImg() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(dest(paths.images.dest));
};

// Clean "dist" folder
function cleanDist() {
  return del(["./dist/*.html", "./dist/css/", "./dist/js/"]);
};

// Copy HTML files from "src" to "dist" folder with replaced JavaScript paths
function copyHTML() {
  return src(paths.html.src)
    .pipe(
      htmlreplace({
        js: {
          src: "./js/main.js",
          tpl: '<script src="%s" defer></script>'
        }
      })
    )
    .pipe(dest("./dist/"));
};

// Copy fonts from "src" to "dist"
function copyFonts() {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dest));
};

// Copy docs files from "src" to "dist"
function copyDocs() {
  return src(paths.docs.src).pipe(dest(paths.docs.dest));
};

// Copy other files from "src" to "dist"
function copyOtherFiles() {
  return src(paths.others.src).pipe(dest("./dist/"));
};

// Revision
function revision() {
  return src("./dist/**/*.{css,js}")
    .pipe(rev())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(dest("./dist/"))
    .pipe(rev.manifest())
    .pipe(dest("./dist/"));
};

// Rewrite
function rewrite() {
  const manifest = readFileSync("./dist/rev-manifest.json");
  return src("./dist/**/*.html").pipe(revRewrite({ manifest })).pipe(dest("./dist/"));
};

// Dev task
exports.default = series(browsersyncServe, watchChanges);

// Production task
exports.build = series(cleanDist, copyHTML, copyFonts, copyDocs, copyOtherFiles, minifyCSS, minifyJS, compressImg, revision, rewrite);
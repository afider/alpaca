# Development environment
Environment for developing front-end layout.

## Requirements for the environment
To create the environment, you must have the following installed tools:
-	Node.js
-	Gulp

If you do not have these tools, then they need to be installed.

## Project dependency settings
To install project dependencies, enter the following commands in the command line:
-	`npm install`

## How to use the environment
  
**Develop mode**: at the command prompt, enter `gulp`.

**Production mode**: at the command prompt, enter `gulp build`. Build a project without sourcemap.

**Custom build**: at the command prompt enter the required task. For example, to build CSS, you must enter the command `css: build`. A list of all available tasks can be found in the `gulpfile.js` file.

**To generate the svg-icons you have to run `svg-make`**

## Structure
The `src` directory contains the project source files. When a file changes, it is transferred to the build directory with all necessary changes.

`pages` — all html-files for the project

`fonts` — all fonts for the project

`img` — all images for the project

`partials` — components of html files that are inserted into the main html file using the [htmlPartial](https://www.npmjs.com/package/gulp-html-partial) plugin

`svg` — SVG icons that turn into a js-file using the `svg-make` task

`js` — all js-files are located here, they are connected in the common.js file using the “// =” syntax of the [rigger](https://www.npmjs.com/package/gulp-rigger) plugin

`style` — all scss-files are located here, they are connected in the common.css file using rigger too.

## Generated website on the server
[https://afider.github.io/alpaca.github.io/](https://afider.github.io/alpaca.github.io/)
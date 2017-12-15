# Atom Weboutline Package

Atom plugin that outlines properties for CSS, JS and PHP in js, css, html and php files.

## Getting Started

These instructions will help you installing and using this atom plugin.

### Prerequisites

First of all you need Atom installed.

### Installing

In atom open Settings > Install. The search for weboutline and press install.

## What is outlined

Files with the following extensions are supported: .css, .js, .html, .php

### css

For css files #id and .class are outlined.

### js

For js files all functions are outlined. You can activate anonymous functions in the settings.

### html

For html files css code within <style type="text/css"></style> and js code within <script></script> is outlined as described above.

### php

For php code functions, classes and methods are outlined. Files that contain mixed html / php are supported.

### custom

You can add custom notes to structure your code with outline.
Use Comment blocks for css, html and single line comments for js and php.

See the following example:

````
js, php: // @ my note
css: /* @ my note */
html: <!-- @ my note -->
````

## Built With

* [Atom](https://atom.io/) - Atom Editor

## Authors

**Leonard Nürnberg** - *Initial work* - [LennyN95](https://github.com/LennyN95)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Donation is welcome :)

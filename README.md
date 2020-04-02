# Atom Weboutline Package

https://atom.io/packages/weboutline

Atom plugin that outlines properties for CSS, JS and PHP in js, css, html and php files.
In .json files arrays and pobjects are outlined. Github Markdown files .md are also supported.

*NOTE: Styling issue fixed - update now ;)*

## Getting Started

These instructions will help you installing and using this atom plugin.

### Prerequisites

First of all you need Atom installed.

### Installing

In atom go to `Settings > Install`. Next search for weboutline and press install.

## What is outlined

Files with the following extensions are supported: `.css`, `.js`, `.html`, `.php`, `.json`, `.md`, `.markdown`

### css 
`.css` `.html` `.php`

Outline is supported for css rules found in .css files or in .html and .php files within a `<style type="text\css"></style>` block.
*Tags*, *Classes* and *IDs* are outlined.
Custom notes start with @ in a css comment block.

### js 
`.js` `.html,` `.php`

In .js files or in .html and .php files within a `<script></script>`block all functions are outlined.
You can change in the package settings wether *anonymous* and *babel like* functions are outlined or not.
Custom notes start with @ in a js single line comment.

### html 
`.html` `.php`

All js and css is outlined as described above. 
Custom notes start with @ in an html comment block.

### php 
`.php`

For php code classes, methods and functions are outlined.
Files that contain mixed html and php are supported. 
Custom notes start with @ in a php single line comment.

### Github Markdown (e.g. README.md) 
`.md` `.markdown`

Headlines are outlined and indented depending on their level. 
Custom notes are *not* supported within .md files.

### json 
`.json`

In json files webmarkdown outlines keys with an object or an array as value.
Custom notes are *not* supported within .md files.
Note that keys must be enclosed in double quotes.

### custom
`@`

You can add custom notes to structure your code with outline.
Use Comment blocks for css, html and single line comments for js and php.

See the following example:
```
js, php:  // @ my note
css:      /* @ my note */
html:     <!-- @ my note -->
```

## Built With

* [Atom](https://atom.io/) - Atom Editor

## Authors

**Leonard Nürnberg** - *Initial work* - [LennyN95](https://github.com/LennyN95)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Donation is welcome :)
<a class="bmc-button" href="https://www.buymeacoffee.com/5R7pfc9"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="BMC logo"><span style="margin-left:5px">Buy me a coffee</span></a>

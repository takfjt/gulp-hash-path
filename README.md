# gulp-md5filename

This forked from [grunt-md5filename](https://github.com/ishikawam/grunt-md5filename)

> Convert file names to MD5.

> ex.) octocat.png -> c29b1fd35e7e51210f3264d567650ac7

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-md5filename`

## Usage

```js
var md5filename = require('gulp-md5filename');

gulp.task('scripts', function() {
    return gulp.src('./img/*.png')
    .pipe(md5filename())
    .pipe(gulp.dest('./dist/'));
});
```

### Options

#### pathType
Type: `String`
Default: 'filename'

select MD5 target for file name or file name with path.

* filename
  * file name
  * ex)

```
octcat.png
->  md5('octcat.png')
c29b1fd35e7e51210f3264d567650ac7
```

* filepath
  * file name with path
  * ex)

```
img/github/octocat.png
->  md5('img/github/octocat.png')
ea8bfe94d1b4278fcd9dca963dde3e00
```

#### keepBasename
Type: `Boolean`
Default: `false`

converted file name add to filename(exclude extension).

```
octcat.png
-> 'octcat' + '-' + md5(octcat.png)
octcat-c29b1fd35e7e51210f3264d567650ac7
```

#### keepExtension
Type: `Boolean`
Default: `false`

converted file name add to extension.

```
octcat.png
-> md5(octcat.png) + '.png'
c29b1fd35e7e51210f3264d567650ac7.png
```

#### keepDirectoryLevel
Type: `Number`
Default: `0`

Level of added directory structure.

```
# keepDirectoryLevel = 1
img/github/octocat.png
->  'img/' + md5('img/github/octocat.png')
img/ea8bfe94d1b4278fcd9dca963dde3e00

# keepDirectoryLevel = 2
img/github/octocat.png
->  'img/github/' + md5('img/github/octocat.png')
img/github/ea8bfe94d1b4278fcd9dca963dde3e00

# keepDirectoryLevel = 3
img/github/octocat.png
->  'img/github/' + md5('img/github/octocat.png')
img/github/ea8bfe94d1b4278fcd9dca963dde3e00
```

#### saltPrefix
Type: `String`
Default: ''

prefix salt

```
octcat.png
-> md5('__PREFIX__octcat.png')
4dd44b339b8ee57d21894ac57c8ca571
```

#### saltSuffix
Type: `String`
Default: ''

suffix salt

```
octcat.png
-> md5('octcat.png__SUFFIX__')
d43bc35325462bf21a3c7fba0902ed86
```

#### ignorePatterns
Type: `Array`
Default: []

ignore file pattern

```
octcat.png
-> ignorePatterns: ['*.png'],
octcat.png
```

#### hashFile
Type: `String`
Default: `null`

save hashmap file, json format.

```
{
  "src/octcat.png": "dest/c29b1fd35e7e51210f3264d567650ac7",
  "src/img/github/octocat.png": "dest/img/github/ea8bfe94d1b4278fcd9dca963dde3e00"
}
```
> **specification changes notice**<br>
> After v0.1.5, json hashmap file specification changes.
> Dest path changes to Grunt root directory relative path.

#### hashLength
Type: `Number`
Default: `null (32)`

split the character length of a hash digest hex value to shorten string.
MD5 is 32 characters in length default.

```
octcat.png
->  md5('octcat.png'), hashLength = 8
c29b1fd3
```


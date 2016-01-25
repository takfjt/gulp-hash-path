# gulp-hash-path

This forked from [grunt-md5filename](https://github.com/ishikawam/grunt-md5filename)

> Convert file paths to hash and keep directory structures.
>
> ex.) path/to/001/octocat.png -> path/to/ad660f5907300f79149bc3dbd9911bd6.png

## Installation

`npm install --save-dev gulp-hash-path`

## Usage

```js
var hash = require('gulp-hash-path');

gulp.task('scripts', function() {
    return gulp.src('./img/*.png')
    .pipe(hash())
    .pipe(gulp.dest('./dist/'));
});
```

## API

### hashPath([options])

#### algorithm

Type: `String`

Default: `sha1`

hash algorithm.

#### pathType

Type: `String`

Default: `filename`

select hash target for file name or file name with path.

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

If you want to use `keepDirectoryLevel`, you set `pathType` to `filepath`.

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

Default: ``

prefix salt

```
octcat.png
-> md5('__PREFIX__octcat.png')
4dd44b339b8ee57d21894ac57c8ca571
```

#### saltSuffix
Type: `String`
Default: ``

suffix salt

```
octcat.png
-> md5('octcat.png__SUFFIX__')
d43bc35325462bf21a3c7fba0902ed86
```

#### ignorePatterns
Type: `Array`
Default: `[]`

ignore file pattern

```
octcat.png
-> ignorePatterns: ['*.png'],
octcat.png
```

#### hashLength
Type: `Number`

Default: `null (32)`

split the character length of a hash digest hex value to shorten string.
hash is 32 characters in length default.

```
octcat.png
->  md5('octcat.png'), hashLength = 8
c29b1fd3
```

### hashPath.manifest(path)

#### path

Type: `String`

set the manifest file path.

# gulp-md5filename

This forked from [grunt-md5filename](https://github.com/ishikawam/grunt-md5filename)

> ファイル名をMD5に変換して保存します
  
> ex.) octocat.png -> c29b1fd35e7e51210f3264d567650ac7

## インストール

NPMでインストールし、depDependenciesに追加します:

`npm install --save-dev gulp-md5filename`

## 使用例

```js
var md5filename = require('gulp-md5filename');

gulp.task('scripts', function() {
    return gulp.src('./img/*.png')
    .pipe(md5filename())
    .pipe(gulp.dest('./dist/'));
});
```
 
### オプション

#### pathType
Type: `String`
Default: 'filename'

MD5変換元の文字列を指定したファイル名にするか、パスを含むファイル名にするか選びます

* filename
  * ファイル名
  * 例:

```
octcat.png
->  md5('octcat.png')
c29b1fd35e7e51210f3264d567650ac7
```

* filepath
  * パスを含むファイル名
  * 例:

```
img/github/octocat.png
->  md5('img/github/octocat.png')
ea8bfe94d1b4278fcd9dca963dde3e00
```

#### keepBasename
Type: `Boolean`
Default: `false`

MD5変換後のファイル名に元のファイル名を接頭辞として付加します

```
octcat.png
-> 'octcat' + '-' + md5(octcat.png)
octcat-c29b1fd35e7e51210f3264d567650ac7
```

#### keepExtension
Type: `Boolean`
Default: `false`

MD5変換後のファイル名に元のファイルの拡張子を接尾辞として付加します

```
octcat.png
-> md5(octcat.png) + '.png'
c29b1fd35e7e51210f3264d567650ac7.png
```

#### keepDirectoryLevel
Type: `Number`
Default: `0`

ディレクトリ構造を指定されたレベルだけ付加します

```
img/github/octocat.png
->  'img/' + md5('img/github/octocat.png'), keepDirectoryLevel = 1
img/ea8bfe94d1b4278fcd9dca963dde3e00

img/github/octocat.png
->  'img/' + md5('img/github/octocat.png'), keepDirectoryLevel = 2
img/github/ea8bfe94d1b4278fcd9dca963dde3e00

img/github/octocat.png
->  'img/' + md5('img/github/octocat.png'), keepDirectoryLevel = 3
img/github/ea8bfe94d1b4278fcd9dca963dde3e00
```

#### saltPrefix
Type: `String`
Default: ''

MD5変換元の文字列にソルト(接頭辞)を指定します

```
octcat.png
-> md5('__PREFIX__octcat.png')
4dd44b339b8ee57d21894ac57c8ca571
```

#### saltSuffix
Type: `String`
Default: ''

MD5変換元の文字列にソルト(接尾辞)を指定します

```
octcat.png
-> md5('octcat.png__SUFFIX__')
d43bc35325462bf21a3c7fba0902ed86
```

#### ignorePatterns
Type: `Array`
Default: []

MD5変換から除外するファイルを指定します

```
octcat.png
-> ignorePatterns: ['*.png'],
octcat.png
```

#### hashFile
Type: `String`
Default: `null`

MD5変換元と変換したファイル名のハッシュマップをjson形式でファイル保存します

```
{
  "src/octcat.png": "dest/c29b1fd35e7e51210f3264d567650ac7",
  "src/img/github/octocat.png": "dest/img/github/ea8bfe94d1b4278fcd9dca963dde3e00"
}
```
> **仕様変更のお知らせ**<br>
> v0.1.5より出力するjsonに記載されるMD5変換後のファイルパスの表記仕様を変更しました。<br>
> Gruntのルートディレクトリからの相対パスになります。

#### hashLength
Type: `Number`
Default: `null (32)`

MD5ハッシュ文字をそのまま使わずに指定した文字数だけ先頭から取り出して短くします。
デフォルトでMD5で生成される文字数は32文字です。

```
octcat.png
->  md5('octcat.png'), hashLength = 8
c29b1fd3
```


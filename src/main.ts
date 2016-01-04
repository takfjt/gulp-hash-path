import * as through2 from 'through2';
import * as gutil from 'gulp-util';

import lodash = require('lodash');
import path = require('path');
import crypto = require('crypto');

interface PluginOptions {
  pathType?: string;
  keepBasename?: boolean;
  keepExtension?: boolean;
  keepDirectoryLevel?: number;
  ignorePatterns?: string[];
  saltPrefix?: string;
  saltSuffix?: string;
  hashFile?: string;
  hashLength?: number;
}

interface File extends gutil.File {
  isBuffer(): boolean;
  isStream(): boolean;
  isNull(): boolean;
}

export = function plugin(_options?: any): NodeJS.ReadWriteStream {
  const defaultOptions: PluginOptions = {
    pathType: 'filename',
    keepBasename: false,
    keepExtension: false,
    keepDirectoryLevel: 0,
    ignorePatterns: [],
    saltPrefix: '',
    saltSuffix: '',
    hashFile: null,
    hashLength: 32
  };
  if (!lodash.isUndefined(_options) &&
      !lodash.isUndefined(_options.keepDirectoryLevel) &&
      !lodash.isUndefined(_options.keepBasename) && _options.keepBasename) {
    this.emit('warning', new gutil.PluginError('gulp-debug', 'ignore keepDirectoryLevel if keepBasename is true'));
  }
  let options = <PluginOptions>lodash.defaults(_options || {}, defaultOptions);

  // from through2.d.ts
  type TransfofmCallback = (err?: any, data?: any) => void;
  type MyFlashCallback = () => void;

  let hashmap: {[s: string]: string} = {};

  return through2.obj(function (file: File, enc: string, callback: TransfofmCallback) {
    const srcPath = file.relative;
    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
      return callback();
    }

    let basename = '';
    let ext = '';

    let keepedDirArray: string[] = [];
    let relativeArray = path.dirname(file.relative).split(path.sep);

    if (options.keepBasename) {
      basename = path.basename(file.path, path.extname(file.path)) + '-';
      options.keepDirectoryLevel = relativeArray.length; // keep all directory level
    }

    if (options.keepExtension) {
      ext = path.extname(file.path);
    }

    for (let i = 0; i < options.keepDirectoryLevel; i++) {
      if (relativeArray.length <= 0) {
        break;
      }
      keepedDirArray.push(relativeArray.shift());
    }

    let target = path.basename(file.path);
    if (options.pathType === 'filepath') {
      target = path.join.apply(null, relativeArray.concat([target]));
    }
    target = options.saltPrefix + target + options.saltSuffix;

    let filename: string;
    let isIgnore = false;

    options.ignorePatterns.forEach((pattern: string) => {
      const re = new RegExp(pattern);
      if (re.test(file.path)) {
        isIgnore = true;
      }
    });
    if (!isIgnore) {
      filename = crypto.createHash('md5').update(target, 'utf-8').digest('hex').slice(0, options.hashLength);
    } else {
      filename = path.basename(file.path);
    }

    const output = path.join.apply(null, keepedDirArray.concat([basename + filename + ext]));

    file.path = path.join(file.base, output);

    hashmap[srcPath] = file.relative;
    this.push(file);

    callback(null, file);
  }, function (callback: MyFlashCallback) {
    if (options.hashFile) {
      const json = JSON.stringify(hashmap);
      let file = new gutil.File({
        base: '',
        path: options.hashFile,
        contents: new Buffer(json)
      });
      this.push(file);
    }
    callback();
  });
};


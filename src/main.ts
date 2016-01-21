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
  algorithm?: string;
  hashFile?: string;
  hashLength?: number;
}

interface File extends gutil.File {
	originalRelative: string;
  isBuffer(): boolean;
  isStream(): boolean;
  isNull(): boolean;
}

// from through2.d.ts
type TransfofmCallback = (err?: any, data?: any) => void;
type MyFlashCallback = () => void;

export interface ExportObject {
	(_options?: any): NodeJS.ReadWriteStream;
	manifest?: {
		(_options?: any): NodeJS.ReadWriteStream;
	}
}

let exportObj: ExportObject;
exportObj = function plugin(_options?: any): NodeJS.ReadWriteStream {
  const defaultOptions: PluginOptions = {
    pathType: 'filename',
    keepBasename: false,
    keepExtension: false,
    keepDirectoryLevel: 0,
    ignorePatterns: [],
    saltPrefix: '',
    saltSuffix: '',
    algorithm: 'sha1',
    hashFile: null,
    hashLength: 32
  };
  if (!lodash.isUndefined(_options) &&
      !lodash.isUndefined(_options.keepDirectoryLevel) &&
      !lodash.isUndefined(_options.keepBasename) && _options.keepBasename) {
    this.emit('warning', new gutil.PluginError('gulp-debug', 'ignore keepDirectoryLevel if keepBasename is true'));
  }
  let options = <PluginOptions>lodash.defaults(_options || {}, defaultOptions);
  try {
    crypto.createHash(options.algorithm);
  } catch (e) {
    throw new gutil.PluginError('gulp-debug', 'invalid hash algorithm');
  }

  return through2.obj(function (file: File, enc: string, callback: TransfofmCallback) {
    const originalRelative = file.relative;
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
      filename = crypto.createHash(options.algorithm).update(target, 'utf-8').digest('hex').slice(0, options.hashLength);

			const output = path.join.apply(null, keepedDirArray.concat([basename + filename + ext]));

			file.path = path.join(file.base, output);
			file.originalRelative = originalRelative;
    }

    this.push(file);

    callback();
  });
};

exportObj.manifest = function manifest(path: string): NodeJS.ReadWriteStream {
  let manifest: {[s: string]: string} = {};

  return through2.obj(function (file: File, enc: string, callback: TransfofmCallback) {
    // black hole
    if (!lodash.isUndefined(file.originalRelative)) {
        manifest[file.originalRelative] = file.relative;
    }
    callback();
  }, function (callback: MyFlashCallback) {
    const json = JSON.stringify(manifest);
    let file = new gutil.File({
      base: '',
      path: path,
      contents: new Buffer(json)
    });
    this.push(file);
    callback();
  });
};

module.exports = exportObj;

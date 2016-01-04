(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'through2', 'gulp-util', 'lodash', 'path', 'crypto'], factory);
    }
})(function (require, exports) {
    var through2 = require('through2');
    var gutil = require('gulp-util');
    var lodash = require('lodash');
    var path = require('path');
    var crypto = require('crypto');
    return function plugin(_options) {
        var defaultOptions = {
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
        var options = lodash.defaults(_options || {}, defaultOptions);
        var hashmap = {};
        return through2.obj(function (file, enc, callback) {
            var srcPath = file.relative;
            if (file.isNull()) {
                this.push(file);
                return callback();
            }
            if (file.isStream()) {
                this.emit('error', new gutil.PluginError('gulp-debug', 'Streaming not supported'));
                return callback();
            }
            var basename = '';
            var ext = '';
            var keepedDirArray = [];
            var relativeArray = path.dirname(file.relative).split(path.sep);
            if (options.keepBasename) {
                basename = path.basename(file.path, path.extname(file.path)) + '-';
                options.keepDirectoryLevel = relativeArray.length; // keep all directory level
            }
            if (options.keepExtension) {
                ext = path.extname(file.path);
            }
            for (var i = 0; i < options.keepDirectoryLevel; i++) {
                if (relativeArray.length <= 0) {
                    break;
                }
                keepedDirArray.push(relativeArray.shift());
            }
            var target = path.basename(file.path);
            if (options.pathType === 'filepath') {
                target = path.join.apply(null, relativeArray.concat([target]));
            }
            target = options.saltPrefix + target + options.saltSuffix;
            var filename;
            var isIgnore = false;
            options.ignorePatterns.forEach(function (pattern) {
                var re = new RegExp(pattern);
                if (re.test(file.path)) {
                    isIgnore = true;
                }
            });
            if (!isIgnore) {
                filename = crypto.createHash('md5').update(target, 'utf-8').digest('hex').slice(0, options.hashLength);
            }
            else {
                filename = path.basename(file.path);
            }
            var output = path.join.apply(null, keepedDirArray.concat([basename + filename + ext]));
            file.path = path.join(file.base, output);
            hashmap[srcPath] = file.relative;
            this.push(file);
            callback(null, file);
        }, function (callback) {
            if (options.hashFile) {
                var json = JSON.stringify(hashmap);
                var file = new gutil.File({
                    base: '',
                    path: options.hashFile,
                    contents: new Buffer(json)
                });
                this.push(file);
            }
            callback();
        });
    };
});

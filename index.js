(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "through2", "gulp-util", "lodash", "path", "crypto"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var through2 = require("through2");
    var gutil = require("gulp-util");
    var lodash = require("lodash");
    var path = require("path");
    var crypto = require("crypto");
    var exportObj;
    exportObj = function plugin(_options) {
        var defaultOptions = {
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
        var options = lodash.defaults(_options || {}, defaultOptions);
        try {
            crypto.createHash(options.algorithm);
        }
        catch (e) {
            throw new gutil.PluginError('gulp-debug', 'invalid hash algorithm');
        }
        return through2.obj(function (file, enc, callback) {
            var originalRelative = file.relative;
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
                filename = crypto.createHash(options.algorithm).update(target, 'utf-8').digest('hex').slice(0, options.hashLength);
                var output = path.join.apply(null, keepedDirArray.concat([basename + filename + ext]));
                file.path = path.join(file.base, output);
                file.originalRelative = originalRelative;
            }
            this.push(file);
            callback();
        });
    };
    exportObj.manifest = function manifest(path) {
        var manifest = {};
        return through2.obj(function (file, enc, callback) {
            // black hole
            if (!lodash.isUndefined(file.originalRelative)) {
                manifest[file.originalRelative] = file.relative;
            }
            callback();
        }, function (callback) {
            var json = JSON.stringify(manifest);
            var file = new gutil.File({
                base: '',
                path: path,
                contents: new Buffer(json)
            });
            this.push(file);
            callback();
        });
    };
    module.exports = exportObj;
});

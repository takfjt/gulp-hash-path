import * as gutil from 'gulp-util';

import path = require('path');
import crypto = require('crypto');
import assert = require('assert');
const hashPath = require('../');

describe('gulp-hashPath', function () {
  let fakeFile;
  beforeEach(function () {
    fakeFile = new gutil.File({
      path: '/base/dir/level1/level2/level3/file.ext',
      base: '/base/dir',
      contents: new Buffer('')
    });
  });
  /*
    pathType: 'filename',
    keepBasename: false,
    keepExtension: false,
    keepDirectoryLevel: 0,
    saltPrefix: '',
    saltSuffix: '',
    hashFile: null,
    hashLength: 32
  */
  it('default', function (done) {
    let stream = hashPath();
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('pathType = \'filepath\'', function (done) {
    let stream = hashPath({
      pathType: 'filepath'
    });

    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('level1/level2/level3/file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('keepBasename', function (done) {
    let stream = hashPath({
      keepBasename: true
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/level3/file-' + hash);
      assert.equal(newFile.relative, 'level1/level2/level3/file-' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('keepExtension', function (done) {
    let stream = hashPath({
      keepExtension: true
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash + '.ext');
      assert.equal(newFile.relative, hash + '.ext');
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('keepDirectoryLevel = 1', function (done) {
    let stream = hashPath({
      keepDirectoryLevel: 1
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/' + hash);
      assert.equal(newFile.relative, 'level1/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('keepDirectoryLevel = 2', function (done) {
    let stream = hashPath({
      keepDirectoryLevel: 2
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/' + hash);
      assert.equal(newFile.relative, 'level1/level2/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('keepDirectoryLevel = 3', function (done) {
    let stream = hashPath({
      keepDirectoryLevel: 3
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/level3/' + hash);
      assert.equal(newFile.relative, 'level1/level2/level3/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('keepDirectoryLevel = 4', function (done) {
    let stream = hashPath({
      keepDirectoryLevel: 4
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/level3/' + hash);
      assert.equal(newFile.relative, 'level1/level2/level3/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('fileType = \'filepath\', keepDirectoryLevel = 1', function (done) {
    let stream = hashPath({
      pathType: 'filepath',
      keepDirectoryLevel: 1
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('level2/level3/file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/' + hash);
      assert.equal(newFile.relative, 'level1/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('fileType = \'filepath\', keepDirectoryLevel = 2', function (done) {
    let stream = hashPath({
      pathType: 'filepath',
      keepDirectoryLevel: 2
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('level3/file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/' + hash);
      assert.equal(newFile.relative, 'level1/level2/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('fileType = \'filepath\', keepDirectoryLevel = 3', function (done) {
    let stream = hashPath({
      pathType: 'filepath',
      keepDirectoryLevel: 3
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/level3/' + hash);
      assert.equal(newFile.relative, 'level1/level2/level3/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('fileType = \'filepath\', keepDirectoryLevel = 4', function (done) {
    let stream = hashPath({
      pathType: 'filepath',
      keepDirectoryLevel: 4
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/level3/' + hash);
      assert.equal(newFile.relative, 'level1/level2/level3/' + hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('ignorePatterns', function (done) {
    let stream = hashPath({
      ignorePatterns: [
        '^/base'
      ]
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/level1/level2/level3/file.ext');
      assert.equal(newFile.relative, 'level1/level2/level3/file.ext');
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('saltPrefix', function (done) {
    let stream = hashPath({
      saltPrefix: 'abc'
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('abc' + 'file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('fileType = \'filepath\', saltPrefix', function (done) {
    let stream = hashPath({
      pathType: 'filepath',
      saltPrefix: 'abc'
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('abc' + 'level1/level2/level3/file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('saltSuffix', function (done) {
    let stream = hashPath({
      saltSuffix: 'xyz'
    });
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha1')
      .update('file.ext' + 'xyz', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('hashFile', function (done) {
    let stream = hashPath({});
    let manifestStream = hashPath.manifest('/manifest/path/mapfile.json');
    let hashmap: {[s: string]: string} = {};
    let json;
    let srcPath = fakeFile.relative;
    stream.on('data', (newFile: gutil.File) => {
      manifestStream.write(newFile);
      hashmap[srcPath] = newFile.relative;
    });
    manifestStream.on('data', (manifestFile: gutil.File) => {
      let json = JSON.parse(manifestFile.contents.toString());
      assert.deepEqual(hashmap, json);
    });
    manifestStream.once('end', function () {
      done();
    });
    stream.once('end', function () {
      manifestStream.end();
      //assert.deepEqual(hashmap, json);
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('md5', function (done) {
    let stream = hashPath({algorithm: 'md5'});
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('md5')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('sha256', function (done) {
    let stream = hashPath({algorithm: 'sha256'});
    stream.on('data', (newFile: gutil.File) => {
      const hash = crypto.createHash('sha256')
      .update('file.ext', 'utf-8')
      .digest('hex').slice(0, 32);
      assert.equal(newFile.base, '/base/dir');
      assert.equal(newFile.path, '/base/dir/' + hash);
      assert.equal(newFile.relative, hash);
    });
    stream.once('end', function () {
      done();
    });
    stream.write(fakeFile);
    stream.end();
  });
  it('invalid hash algorithm (null)', function (done) {
    assert.throws(
        function () {
          let stream = hashPath({algorithm: null});
        },
        /invalid hash algorithm/
    );
    done();
  });
  it('invalid hash algorithm (invalid name)', function (done) {
    assert.throws(
        function () {
          let stream = hashPath({algorithm: 'invalid name'});
        },
        /invalid hash algorithm/
    );
    done();
  });
});

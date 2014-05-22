/*
 * Functionality involving gridfs calls should be tested here.
 */

var assert = require("assert");
var mongoose = require('mongoose');
var dbinit = require('./dbinit');
var gridfs = require('../../services/utils').gfs;
var fs = require('fs');
var testRoot = 'testGrid';

describe('Test the gridfs utilities', function () {
  var testReadStream;
  var testWriteOptions;
  var testWriteStream;
  var testReadOptions;
  beforeEach(function(done) {
    testReadStream = fs.createReadStream('./app.js');
    assert.ok(testReadStream);
    testWriteOptions = {
      filename: 'gridfs-test.js',
      content_type: 'plain/text',
      root: testRoot
    };
    done();
  })

  it('should put readablestream data in db', function (done) {
    gridfs.putStream(testReadStream, testWriteOptions, function(err, fileInfo) {
      assert.ok(!err);
      assert.ok(fileInfo);
      assert.ok(fileInfo._id);
      done()
    });
  });
  it('should put second readablestream data in db', function (done) {
    gridfs.putStream(testReadStream, testWriteOptions, function(err, fileInfo) {
      assert.ok(!err);
      assert.ok(fileInfo);
      assert.ok(fileInfo._id);
      done()
    });
  });
});
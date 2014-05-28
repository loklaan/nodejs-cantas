/*
 * Functionality involving gridfs calls should be tested here.
 */

var assert = require("assert");
var mongoose = require('mongoose');
var gridfs = require('../../services/utils').gfs;
var fs = require('fs');

describe('Test the gridfs utilities', function () {
  var testReadStream;
  var testWriteOptions;
  beforeEach(function(done) {
    // just use the main js file of cantas as test data
    testReadStream = fs.createReadStream('./app.js');
    assert.ok(testReadStream);
    testWriteOptions = {
      filename: 'gridfs-test.js',
      content_type: 'plain/text',
      root: 'testGrid',
      metadata: {
        'wonder child': 'yo'
      }
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
  it('should get file from grid ', function (done) {
    gridfs.putStream(testReadStream, testWriteOptions, function(err, fileInfo) {
      gridfs.getStream(fileInfo._id, testWriteOptions.root, function(err, data) {
        assert.ok(!err);
        assert.ok(data);
        done();
      });
    });
  });
  it('should get info file in gridfs', function (done) {
    gridfs.putStream(testReadStream, testWriteOptions, function(err, fileInfo) {
      gridfs.getInfo(fileInfo._id, testWriteOptions.root, function(err, otherInfo) {
        assert.ok(!err);
        assert.ok(otherInfo);
        done();
      });
    });
  });
});
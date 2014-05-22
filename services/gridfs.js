/**
 * Contains helper functions to make GridFS easier.
 */

(function(module) {
  "use strict";

  var settings = require('../settings.js')
  var mongoose = require('mongoose');
  var ObjectID = mongoose.mongo.ObjectID;
  var mongo = mongoose.mongo;
  var Grid = require('gridfs-stream');
      Grid.mongo = mongo;

  /**
   * Gets a stream of a file from GridFS
   * @param  {ObjectID} id           ObjectID of file in GridFS
   * @param  {Object}   [collection] Optional reference to specific MongoDB
   *   collection. Defaults 'fs'
   * @param  {Function} callback     Callback with first parameter being error
   *   and second parameter being a stream
   * @return {null}
   */
  module.exports.getStream = function(id, collection, callback) {
  };

  /**
   * Gets a buffer of a file from GridFS
   * @param  {ObjectID} id           ObjectID of file in GridFS
   * @param  {Object}   [collection] Optional reference to specific MongoDB
   *   collection. Defaults 'fs'
   * @param  {Function} callback     Callback with first parameter being error
   *   and second parameter being info object. Reference
   *   mongodb.github.io/node-mongodb-native/api-generated/grid.html
   * @return {null}
   */
  module.exports.getInfo = function(id, collection, callback) {
  }

  /**
   * Puts the buffer of a file into GridFS
   * @param  {Readable} data     File to put into GridFS, as a readable stream
   * @param  {Object}   options  [description]
   * @param  {Function} callback Callback with first parameter being error and second parameter being a reference to this document in GridFS.
   * @return {null}
   */
   module.exports.putStream = function(data, options, callback) {
    openDb(function(conn) {
      var opts = parseOptions(options);

      var store = Grid(conn.db);
      var storeStream = store.createWriteStream(opts);
      storeStream.on('error', callback);
      data.pipe(storeStream.on('close', function(fileInfo) {
        console.log(fileInfo)
        conn.close();
        callback(null, fileInfo)
      }))
    })
  };

  /**
   * Gets a read stream to a file in GridFS
   * @param  {Object}   options [description]
   * @param  {Function} callback      Callback with first parameter error and second
   *   parameter as a read stream
   * @return {null}
   */
   module.exports.createReadStream = function(options, callback) {

   };

  /**
   * Parse options, ensuring given are keeping to:
   * https://www.npmjs.org/package/gridfs-stream#createwritestream
   */
  function parseOptions(options) {
    var opts = {};
    if ((Object.keys(options)).length > 0) {
      opts = options;
    }
    opts._id = opts._id || new ObjectID();
    opts.mode = opts.mode || "r";
    opts.metadata = opts.metadata || {};

    if (!opts.root) {
      console.log(opts);
      throw new Error('Collection name required to use gridfs utils');
    }
    if (!opts.filename) {
      console.log(opts);
      throw new Error('Filename required to use gridfs utils');
    }

    return opts;
   }

    /**
     * GridFS requires an open mongodb connection, this waits for an open emit
     *   event and returns the db object define by the mongodb driver. The
     *   mongo connection status of being 'open' when used by gridfs is
     *   pedantic.
     * @param  {Function} callback Callback once the open event is emitted.
     *   First paramter is the new mongoose connection.
     */
    function openDb(callback) {
      var opts = {
        db: settings.mongodb.name,
        user: settings.mongodb.user,
        pass: settings.mongodb.pass
      }

      var newConn = mongoose.createConnection(
        settings.mongodb.host,
        settings.mongodb.port,
        opts
        );

      newConn.on('open', function() {
        callback(newConn);
      })
    }

}(module))

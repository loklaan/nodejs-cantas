(function(module) {

  "use strict";

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  var UserSchema;
  var gfs = require('../services/utils.js').gfs;
  var avatarRoot = 'avatars';

  UserSchema = new Schema({
    // avatar field contains id for a GridFS file, refer to GridFS helpers
    avatar: ObjectId,
    username: { type: String, required: true, lowercase: true, unique: true },
    fullname: { type: String, default: '' },
    password: { type: String, default: '', select: false },
    email: { type: String, required: true, lowercase: true, unique: true },
    joined: { type: Date, default: Date.now },
    roles: [ ObjectId ],
    isFirstLogin: { type: Boolean, default: true }
  });

  // instance methods

  UserSchema.method('setAvatar', function(imageStream, options) {
    var _this = this;
    options.root = avatarRoot;
    gfs.putStream(imageStream, options, function(err, info) {
      if (err) {
        throw err;
      }

      _this.update({ avatar : info._id }, function(err, affected, raw) {
        if (err) {
          throw err;
        }
      });
    });
  });

  // virtual

  UserSchema.virtual('url').get(function() {
    return '/user/' + this.id + '/avatar';
  });

  // static method

  UserSchema.statics.getAvatarById = function(identity, callback) {
    this.findById(identity, function(err, user) {
      if (err) {
        callback(err, null);
      }
      if (!user.avatar) {
        callback(new Error('User has no avatar.'), null);
      }
      gfs.getStream(user.avatar, avatarRoot, function(err, imageStream) {
        if (err) {
          throw err;
        }
        callback(null, imageStream);
      });
    });
  };

  UserSchema.statics.getAvatarInfoById = function(identity, callback) {
    this.findById(identity, function(err, user) {
      if (err) {
        callback(err, null);
      }
      if (!user.avatar) {
        callback(new Error('User has no avatar.'), null);
      }
      gfs.getInfo(user.avatar, avatarRoot, function(err, imageInfo) {
        if (err) {
          throw err;
        }
        callback(null, imageInfo);
      });
    });
  };

  UserSchema.statics.getByUsername = function(identity, callback) {
    var condition = { username: identity };
    this.findOne(condition, callback);
  };

  UserSchema.statics.exists = function(identity, callback) {
    var conditions = { $or: [{ username: identity }, { email: identity }] };
    this.findOne(conditions, "username", function(err, user) {
      callback(user !== undefined && user !== null);
    });
  };

  module.exports = mongoose.model('User', UserSchema);

}(module));


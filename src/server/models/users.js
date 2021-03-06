/* eslint-disable key-spacing */

const mongoose = require('mongoose');
const validator = require('validator');


// schema
const UsersSchema   = new mongoose.Schema({
  active            : { type: String, default: false },
  role              : { type: String, enum: ['admin', 'coordinator', 'editor'], default: 'editor' },
  username          : { type: String, unique: true, lowercase: true },
  email             : { type: String,
    unique          : true,
    required        : true,
    validate: {
      isAsync       : false,
      validator     : validator.isEmail,
      message       : 'Invalid email address',
    } },
  nickname          : { type: String },
  picture           : { type: String, default: '' },                                                                    // todo: added a validator
  info: {
    firstName       : { type: String, default: '', trim: true },
    lastName        : { type: String, default: '', trim: true },
    gender          : { type: String, enum: ['Male', 'Female', 'NA'], default: 'NA' },
    residency       : { type: String },
    timezone        : { type: String },
    birthday        : { type: Date },
  },
  time: {
    _signIn         : { type: Date },
    _changePassword : { type: Date },
  },
}, {
  timestamps        : { createdAt: 'time._registered', updatedAt: 'time._updated' },
  versionKey        : false,
  toJSON            : { virtuals: true },
});


// action hooks
// // nickname assignment (pre-hook)
UsersSchema.pre('save', function UsersSchema_pre_save() {
  if (this.nickname === undefined) this.nickname = `${this.info.firstName} ${this.info.lastName}`.trim();
});


// // auto-update all posts associated with the author in dark (pre-hook)
UsersSchema.pre('update', function UsersSchema_pre_update() {
  const _$update = this.getUpdate();
  if (_$update.$set.nickname !== _$update.$set._$nickname) {
    mongoose.connection.db.collection('posts').update(
      { 'author._id': this.getQuery()._id },
      { $set: { 'author.nickname': _$update.$set.nickname } },
      { multi: true },
    );
  }
});


// methods for documents
// // update the specified last time field
UsersSchema.methods.updateLastTimeLog = function UsersSchema_updateLastTimeLog(fieldName) {
  return mongoose.connection.db.collection('users').update(
    { _id: this._id },
    { $set: { [`time._${fieldName}`]: new Date(Date.now()) } },
  );
};


// virtual method for user-post association
// // to-use: UsersModel.findOne({}).populate({ path: 'posts', match: { 'time._recycled': { $eq: null } }}).exec();
UsersSchema.virtual('posts', {
  ref         : 'posts',
  localField  : '_id',
  foreignField: 'author._id',
});


// exports
module.exports = mongoose.model('users', UsersSchema);

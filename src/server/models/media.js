/* eslint-disable key-spacing */

const mongoose = require('mongoose');


// schema
const MediaSchema   = new mongoose.Schema({
  author: {
    _id             : { type: String },
    nickname        : { type: String },
  },
  file: {
    name            : { type: String },
    path            : { type: String },
    ext             : { type: String },
  },
  title             : { type: String, trim: true, required: [true, 'is required'] },
  description       : { type: String, trim: true, required: [true, 'is required'] },
  category          : { type: String, lowercase: true },
  tag               : { type: String, lowercase: true },
}, {
  timestamps        : { createdAt: 'time.uploaded', updatedAt: 'time._updated' },
  versionKey        : '_revised',
});


// action hooks
MediaSchema.pre('findOneAndUpdate', function MediaSchema_pre_findOneAndUpdate() {
  this.findOneAndUpdate({}, { $inc: { _revised: 1 } });
});


// exports
module.exports = mongoose.model('media', MediaSchema);

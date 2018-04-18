const mongoose = require('mongoose');



// modules
const { _U_ } = require('../controllers/utilities/');



// schema
const MediaSchema    = new mongoose.Schema({
  author: {
    _id: {
      type           : mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    nickname         : { type: String },
  },
  file: {
    type             : { type: String },
    path             : { type: String },
    name             : { type: String },
  },
  title              : { type: String, trim: true, required: [true, 'is required'] },
  description        : { type: String, trim: true, required: [true, 'is required'] },
  category           : { type: String, lowercase: true },
  tag                : { type: String, lowercase: true },
}, {
  timestamps         : { createdAt: 'time.uploaded', updatedAt: 'time._updated' },
  versionKey         : '_revised',
});



// action hooks
MediaSchema.pre('findOneAndUpdate', function () {
  this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
});



// exports
module.exports = mongoose.model('media', MediaSchema);

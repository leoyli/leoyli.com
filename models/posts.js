const mongoose = require('mongoose');



// schema
const PostsSchema    = new mongoose.Schema({
  author: {
    _id: {
      type           : mongoose.Schema.Types.ObjectId,
      ref            : 'users',
    },
    nickname         : { type: String },
  },
  featured           : { type: String,                                                                                    // todo: featured by a video
    validate: {
      validator      : value => value !== undefined,
      message        : 'Invalid image URL',
    }},
  canonical          : { type: String, lowercase: true, unique: true },
  title              : { type: String, required: [true, 'is required'], trim: true },
  content            : { type: String, required: [true, 'is required'], trim: true },
  category           : { type: String, lowercase: true, default: 'unclassified' },
  tags               : { type: String, lowercase: true },
  state: {
    published        : { type: Boolean, required: true, default: true },
    protected        : { type: Boolean, required: true, default: false },                                                 // todo: add pw
    hidden           : { type: Boolean, required: true, default: false },                                                 // todo: add anti-robot HTML tag
    pinned           : { type: Boolean, required: true, default: false },
  },
  time: {
    _recycled        : { type: Date },
  },
}, {
  timestamps         : { createdAt: 'time._created', updatedAt: 'time._updated' },
  versionKey         : '_revised',
});



// indexes
PostsSchema
  .index({ 'tags' : 1 })
  .index({ 'category' : -1 })
  .index({ 'time._updated' : -1 })
  .index({ 'time._recycled' : 1 }, { expireAfterSeconds: 14 * 24 * 3600 * 1000 })
  .index({ 'title': 'text', 'content': 'text', 'category': 'text', 'tags' : 'text' });



// action hooks
//// version counter (pre-hook)
PostsSchema.pre('findOneAndUpdate', function () {
  this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
});

//// recycle setter (pre-hook)
PostsSchema.pre('update', function () {
  const _$update = this.getUpdate();
  if (_$update.$set['state.pended'] === true) _$update.$set['state.published'] = false;                                 // tofix: initial post ist not worked
  if (_$update.$set['state.recycled'] === true) _$update.$set = { 'time._recycled': Date.now() };
  if (_$update.$set['state.recycled'] === false) _$update.$set = { 'time._recycled': null };
});



// virtual property
PostsSchema.virtual('state.pended').get(function () {
  return !this.state.published;
});

PostsSchema.virtual('state.recycled').get(function () {
  return !!this.time._recycled;
});

PostsSchema.virtual('time._expired').get(function () {
  return this.time._recycled ? new Date(this.time._recycled.getTime() + 14 * 24 * 3600 * 1000) : null;
});



// exports
module.exports = mongoose.model('posts', PostsSchema);

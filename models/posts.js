const
    mongoose                = require('mongoose');


// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const { _U_ }               = require('../controllers/utilities/');



// ==============================
//  SCHEMA
// ==============================
const PostsSchema           = new mongoose.Schema({
    author: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'users',
        },
        nickname            : { type: String },
    },
    featured                : { type: String, // todo: featured by a video
        validate: {
            validator       : value => value !== undefined,
            message         : 'Invalid image URL',
        }},
    canonical               : { type: String, lowercase: true, unique: true },
    title                   : { type: String, required: [true, 'is required'], trim: true },
    content                 : { type: String, required: [true, 'is required'], trim: true },
    category                : { type: String, lowercase: true, default: 'unclassified' },
    tags                    : { type: String, lowercase: true },
    visibility: {
        hidden              : { type: Boolean, default: false },    // todo: add anti-robot HTML tag
        pinned              : { type: Boolean, default: false },
        protected           : { type: Boolean, default: false },    // todo: add pw
    },
    status                  : { type: String, default: 'published',
                                enum: ['drafted','published', 'recycled'] },
}, {
    timestamps              : { createdAt: 'time.created', updatedAt: 'time.updated' },
    versionKey              : '_revised',
})
    .index({ 'tags' : 1 })
    .index({ 'status' : 1 })
    .index({ 'category' : -1 })
    .index({ 'time.updated' : -1 })
    .index({ 'title': 'text', 'content': 'text', 'category': 'text', 'tags' : 'text' });



// ==============================
//  METHODS
// ==============================
// action hooks
// version counter (pre-hook)
PostsSchema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
});



// exports
module.exports = mongoose.model('posts', PostsSchema);

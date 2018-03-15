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
const PostSchema            = new mongoose.Schema({
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
        hidden              : { type: Boolean, required: true, default: false },    // todo: add anti-robot HTML tag
        pinned              : { type: Boolean, required: true, default: false },
        protected           : { type: Boolean, required: true, default: false },    // todo: add pw
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
//  STATIC METHODS
// ==============================
// create and associate (model)
PostSchema.static('postsCreateThenAssociate', function (raw, user, next) {
    return Promise.resolve().then(() => _U_.schema.updateAndBind(raw, user, next, 'posts', '$push', this));
});


// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteThenDissociate', function (docsID, user, next) {
    return Promise.resolve().then(() => _U_.schema.updateAndBind(docsID, user, next, 'posts', '$pullAll', this));
});


// (pre-hook) version counter
PostSchema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
});



// exports
module.exports = mongoose.model('posts', PostSchema);

const
    mongoose                = require('mongoose'),
    validator               = require('validator');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const { _fn }               = require('../controllers/helpers');



// ==============================
//  SCHEMA
// ==============================
const PostSchema            = new mongoose.Schema({
    author: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'users',
        },
        username            : { type: String },
    },
    featured                : { type: String, // todo: featured by a video
        validate: {
            validator       : value => value !== undefined,
            message         : 'Invalid image URL',
        }},
    canonical               : { type: String, lowercase: true, unique: true },
    title                   : { type: String, required: [true, 'is required'], trim: true },
    content                 : { type: String, required: [true, 'is required'], trim: true },
    category                : { type: String, lowercase: true, default: 'unclassified'},
    tag                     : { type: String, lowercase: true },
    status                  : { type: String, required: [true, 'is required'],
                                enum: ['drafted','published', 'recycled'] },
    visibility              : { type: String, required: [true, 'is required'],
                                enum: ['normal', 'pinned', 'hided', 'protected'] },
}, {
    timestamps              : { createdAt: 'time.created', updatedAt: 'time.updated' },
    versionKey              : '_revised',
})
    .index({ 'status' : 1 })
    .index({ 'category' : -1 })
    .index({ 'time.updated' : -1 })
    .index({ 'title': 'text', 'content': 'text', 'category': 'text', 'tag' : 'text' });



// ==============================
//  STATIC METHODS
// ==============================
// create and associate (model)
PostSchema.static('postsCreateThenAssociate', function (raw, user, next) {
    return Promise.resolve().then(() => _fn.schema.updateAndBind(raw, user, next, 'posts', '$push', this));
});


// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteThenDissociate', function (docsID, user, next) {
    return Promise.resolve().then(() => _fn.schema.updateAndBind(docsID, user, next, 'posts', '$pullAll', this));
});


// (pre-hook) version counter
PostSchema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
});



// export model
module.exports = mongoose.model('posts', PostSchema);

const
    mongoose                = require('mongoose'),
    validator               = require('validator');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const { _fn }               = require('../controllers/modules/methods');

// validating functions
function featured (value) {
    if (!value) return true;
    return validator.isURL(value);
}



// ==============================
//  SCHEMA
// ==============================
const PostSchema            = new mongoose.Schema({
    author: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        username            : { type: String },
    },
    featured                : { type: String, // todo: featured by a video
        validate: {
            isAsync         : false,
            validator       : featured,
            message: 'Invalid URL',
        }},
    title                   : { type: String, trim: true, required: [true, 'is required'] },
    content                 : { type: String, trim: true, required: [true, 'is required'] },
    category                : { type: String, lowercase: true, default: 'unclassified'}, // tofix: empty space handling
    tag                     : { type: String, lowercase: true },
    canonical               : { type: String, lowercase: true, unique: true },
}, {
    timestamps              : { createdAt: 'time.created', updatedAt: 'time.updated' },
    versionKey              : '_revised',
}).index({ 'title': 'text', 'content': 'text', 'tag' : 'text' });



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


// (pre-hook) canonical key evaluation
PostSchema.pre('save', function (next) {
    if (!this.canonical) this.canonical = _fn.string.canonicalize(this.title);  // tofix: unavailable if pre-existed
    next();
});


// (pre-hook) version counter
PostSchema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
    next();
});



// export model
module.exports = mongoose.model('posts', PostSchema);

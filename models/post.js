const
    mongoose                = require('mongoose'),
    validator               = require('validator');



// define validation rules
function featured (value) {
    if (!value) return true;
    return validator.isURL(value);
}



// define new (DB)data schema
const PostSchema            = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    _pinTop                 : {type: Boolean, default: false},
    provider: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER',
        },
        username            : {type: String},
    },
    featured                : {type: String, // todo: featured by a video
        validate: {
            isAsync         : false,
            validator       : featured,
            message         : 'INVALID URL',
        }},
    title                   : {type: String, required: true, trim: true},
    canonicalKey            : {type: String, lowercase: true, unique: true},
    class                   : {type: String, lowercase: true, default: 'unclassified'}, // tofix: empty space handling
    tag                     : {type: String, lowercase: true},
    content                 : {type: String, required: true},
}, {
    timestamps              : {createdAt: '_created', updatedAt: '_updated'},
    versionKey              : '_revised',
});



// define new methods
const exMethods             = require('../config/methods');

//// create and associate (model)
PostSchema.static('postsCreateThenAssociate', function (raw, user, next) {
    return exMethods.correlateAsCreateOrDelete(raw, user, next, 'posts', '$push', this);
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteThenDissociate', function (docsID, user, next) {
    return exMethods.correlateAsCreateOrDelete(docsID, user, next, 'posts', '$pullAll', this);
});


//// (pre-hook) canonical key evaluation
PostSchema.pre('save', function (next) {
    if (!this.canonicalKey || this.canonicalKey === '') {
        this.canonicalKey = this.title.replace(/[~!@#$%^&*()_+`\-=\[\]\\;',.\/{}|:"<>?\s]+/g, '-').replace(/-$/, '');
    }
    next();
});


//// (pre-hook) version counter
PostSchema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, {$inc: {_revised: 1}});
    next();
});



// export model
module.exports = mongoose.model('POST', PostSchema);

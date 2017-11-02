const
    mongoose                = require('mongoose');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const _fn                   = require('../config/methods');



// ==============================
//  SCHEMA
// ==============================
const MediaSchema           = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    provider: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER',
        },
        username            : {type: String},
    },
    file: {
        fullPath            : {type: String},
        fileBase            : {type: String},
        fileType            : {type: String},
    },
    title                   : {type: String, required: true},
    description             : {type: String, required: true},
    class                   : {type: String, lowercase: true},
    tag                     : {type: String, lowercase: true},
}, {
    timestamps              : {createdAt: '_uploaded', updatedAt: '_updated'},
    versionKey              : '_revised',
});



// ==============================
//  STATIC METHODS
// ==============================
// create and associate (model)
MediaSchema.static('mediaCreateThenAssociate', function (raw, user, next) {
    return Promise.resolve().then(() => _fn.schema.updateAndBind(raw, user, next, 'media', '$push', this));
});


// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
MediaSchema.static('mediaDeleteThenDissociate', function (docsID, user, next) {
    return Promise.resolve().then(() => _fn.schema.updateAndBind(docsID, user, next, 'media', '$pullAll', this));
});


// (pre-hook) version counter
MediaSchema.pre('findOneAndUpdate', function (next) {
    this.findOneAndUpdate({}, {$inc: {_revised: 1}});
    next();
});



// export model
module.exports = mongoose.model('MEDIA', MediaSchema);

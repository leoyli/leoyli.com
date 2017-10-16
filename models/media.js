const
    mongoose                = require('mongoose');



// define new (DB)data schema
const MediaSchema           = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    provider: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER',
        },
        username            : {type: String},   // todo: nickname, and can be updated once changed
    },
    file: {
        fullPath            : {type: String},
        fileName            : {type: String},
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



// define new methods
const exMethods             = require('../config/methods');

//// create and associate (model)
MediaSchema.static('mediaCreateThenAssociate', function (raw, user, next) {
    return new exMethods.CorrelateAsCreateOrDelete(raw, user, next, 'media', '$push', this);
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
MediaSchema.static('mediaDeleteThenDissociate', function (docsID, user, next) {
    return new exMethods.CorrelateAsCreateOrDelete(docsID, user, next, 'media', '$pullAll', this);
});


//// image upload (model)
MediaSchema.static('mediaUpload', require('../config/busboy'));


//// version counter (object method)
MediaSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('MEDIA', MediaSchema);

const
    mongoose                = require('mongoose');



// define new (DB)data schema
const
    MediaSchema             = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    uploader: {
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
const extFn                 = require('../config/extFn');

//// create and associate (model)
MediaSchema.static('mediaCreateAndAssociate', function (raw, user, next) {
    return (async (raw, user, next) => {
        if (user) raw.map(self => self.uploader = user);
        const docs = await this.create(raw);
        if (user) await user.update({$pushAll: {ownedMedia: docs}});
        return next(null, docs);
    })(...extFn.normalization(raw, user, next));
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
MediaSchema.static('mediaDeleteAndDissociate', function (docsID, user, next) {
    return (async (docsID, user, next) => {
        await this.remove({_id: docsID});
        await user.update({$pullAll: {ownedPosts: docsID}});
        return next(null, docsID);
    })(...extFn.normalization(docsID, user, next));
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

const
    mongoose                = require('mongoose');



// define new (DB)data schema
const
    MediaSchema             = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    uploader                : {
        _id                 :
            {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER'
            },
        username            : String    // todo: nickname, and can be updated once changed
    },
    file                    :
        {
            path            : {type: String},
            filename        : {type: String},
            ext             : {type: String}
        },
    title                   : {type: String},  // todo: required: true
    description             : {type: String},
    class                   : {type: String, lowercase: true},
    tag                     : {type: String, lowercase: true}
}, {
    timestamps              : {createdAt: '_uploaded', updatedAt: '_updated'},
    versionKey              : '_revised'
});



// define new methods
//// creation and association (model)
MediaSchema.static('mediaCreateAndAssociate', function(docs, user, next) {
    // normalize & check
    if (typeof next !== 'function') next = (err, docs) => {return docs};
    if (!Array.isArray(docs)) docs = [docs];
    if (docs.length === 0 || !docs[0]) return next(null, null); // tofix: ignored errors


    // associate & create
    if (user) docs.map(self => self.uploader = user);
    return this.create(docs, (err, docs) => {
        if (user) user.update({$pushAll: {ownedMedia: docs}}).then(next(err, docs)); // tofix: potential errors
        else next(err, docs);
    });
});


//// delete and dissociate (model)
MediaSchema.static('postsDeleteAndDissociate', function(docsID, user, next) {
    // normalize & check
    if (typeof next !== 'function') next = (err, docsID) => {return docsID}; // tofix: ignored errors
    if (!Array.isArray(docsID)) docsID = [docsID];
    if (docsID.length === 0 || !docsID[0]) return next(null, null);

    // remove and dissociate
    return this.remove({_id: docsID}, err => {
        if (user) user.update({$pullAll: {ownedMedia: docsID}}).then(next(err, docsID));  // tofix: potential errors
        else next(err, docsID);
    });
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

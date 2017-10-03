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
MediaSchema.static('mediaCreateAndAssociate', function (docs, user, next) {
    return new Promise((resolve, reject) => {
        // promise state handler
        if (typeof next !== 'function') next = (err, docs) => {
            if (err) return reject(err);
            resolve(docs);
        };

        // normalization
        if (!Array.isArray(docs)) docs = [docs];
        if (docs.length === 0 || !docs[0]) return next(new Error('NO DATA BEING PROVIDED.'), null);

        // main logic
        if (user) docs.map(self => self.uploader = user);
        this.create(docs, (err, docs) => {
            if (err) return next(err, null);
            if (user) user.update({$pushAll: {ownedMedia: docs}}, (err, docs) => next(err, docs));
            else next(err, docs);
        });
    })
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
MediaSchema.static('mediaDeleteAndDissociate', function (docsID, user, next) {
    return new Promise((resolve, reject) => {
        // promise state handler
        if (typeof next !== 'function') next = (err, docs) => {
            if (err) return reject(err);
            resolve(docs);
        };

        // normalization
        if (!Array.isArray(docsID)) docsID = [docsID];
        if (docsID.length === 0 || !docsID[0]) return next(new Error('NO DATA BEING PROVIDED.'), null);

        // main logic
        this.remove({_id: docsID}, err => {
            if (err) return next(err, null);
            if (user) user.update({$pullAll: {ownedMedia: docsID}}, (err, docs) => next(err, docs));
            else next(err, docsID);
        });
    })
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

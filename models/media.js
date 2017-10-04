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
const extFn                 = require('../config/extFn');

//// create and associate (model)
MediaSchema.static('mediaCreateAndAssociate', function (raw, user, next) {
    return extFn.normalization(raw, user, next, (raw, user, next) => {
        if (user) raw.map(self => self.uploader = user);
        this.create(raw, (err, docs) => {
            if (err) return next(err, null);
            if (user) user.update({$pushAll: {ownedMedia: docs}}, (err, dbRes) => next(err, docs));
            else next(null, docs);
        });
    });
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
MediaSchema.static('mediaDeleteAndDissociate', function (docsID, user, next) {
    return extFn.normalization(docsID, user, next, (docsID, user, next) => {
        this.remove({_id: docsID}, err => {
            if (err) return next(err, null);
            if (user) user.update({$pullAll: {ownedMedia: docsID}}, (err, dbRes) => next(err, docsID));
            else next(null, docsID);
        });
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

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
MediaSchema.static('mediaCreateAndAssociate', function  (req, res, docs, next) {
    // normalize to an array
    if (!Array.isArray(docs)) docs = [docs];

    // ignore if no data being passed
    if (docs.length === 0 || !docs[0]) return next();

    // associate with the uploader
    if (req.user) docs.map(self => self.uploader = req.user);

    // create doc(s)
    this.create(docs, function (err, createdMedia) {
        // associate with the doc(s) // note: if statement prevents from unSignIn crash
        if (req.user) {
            req.user.ownedMedia = req.user.ownedMedia.concat(createdMedia);
            req.user.save(err => next(err, createdMedia));
        } else return next(err, createdMedia);
    });
});


//// image upload (model)
MediaSchema.static('mediaUpload', require('../config/busboy'));


//// version counter (object method)
MediaSchema.methods.reviseCounter = function () {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('MEDIA', MediaSchema);

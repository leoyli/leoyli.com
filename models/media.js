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
MediaSchema.static('mediaCreateAndAssociate', function(req, res, docs, next) {
    // normalize & check
    if (typeof next !== 'function') next = (err, docs) => {return docs};
    if (!Array.isArray(docs)) docs = [docs];
    if (docs.length === 0 || !docs[0]) return next();

    // associate & create
    if (req.user) docs.map(self => self.uploader = req.user);
    return this.create(docs)
        .then(docs => {
            if (req.user) {
                req.user.ownedMedia = req.user.ownedMedia.concat(docs);
                req.user.save();
            } return next(null, docs);
        });
});


//// todo: deletion and isolation (model)


//// image upload (model)
MediaSchema.static('mediaUpload', require('../config/busboy'));


//// version counter (object method)
MediaSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('MEDIA', MediaSchema);

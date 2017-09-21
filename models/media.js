const
    mongoose                = require('mongoose');



// define new (DB)data schema
var MediaSchema              = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    uploader                : {
        _id                 :
            {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER'
            },
        username            : String    // todo: nickname, and can be updated once changed
    },
    path                    : {type: String},
    filename                : {type: String},
    extname                 : {type: String},
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
MediaSchema.static('mediaCreateAndAssociate', function  (req, res, media, next) {
    // normalize to an array
    if (!Array.isArray(media)) {
        media = [media];
    }

    // associate with the uploader
    media.map(function (self) {
        self.uploader = req.user;
        return self;
    });

    // create doc(s)
    this.create(media, function (err, createdMedia) {
        // associate with the doc(s) // note: if statement prevents from unSignIn crash
        if (req.user) {
            req.user.ownedMedia = req.user.ownedMedia.concat(createdMedia);
            req.user.save(function (err) {
                return next(err, createdMedia);
            });
        } else {
            return next(err, createdMedia);
        }
    });
});


//// version counter (object method)
MediaSchema.methods.reviseCounter = function () {
    ++this._revised;
    this.save();
};



// create a new model then export
module.exports = mongoose.model('MEDIA', MediaSchema);

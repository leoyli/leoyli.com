const
    mongoose                = require('mongoose'),
    validator               = require('validator');



// define new (DB)data schema
const
    PostSchema              = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    _pinTop                 : {type: Boolean, default: false},
    author: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER',
        },
        username            : {type: String},
    },
    featured                : {type: String, // todo: featured by a video
        validate: {
            isAsync         : false,
            validator       : validator.isURL,
            message         : 'INVALID URL',
        }},
    title                   : {type: String, required: true, trim: true},
    class                   : {type: String, lowercase: true, default: 'unclassified'},
    tag                     : {type: String, lowercase: true},
    content                 : {type: String, required: true},
}, {
    timestamps              : {createdAt: '_created', updatedAt: '_updated'},
    versionKey              : '_revised',
});



// define new methods
const extFn                 = require('../config/extFn');

//// create and associate (model)
PostSchema.static('postsCreateAndAssociate', function (raw, user, next) { // tofix: Promise bug
    return extFn.normalization(raw, user, next, (raw, user, next) => {
        if (user) raw.map(self => self.author = user);
        this.create(raw, (err, docs) => {
            if (err) return next(err, null);
            if (user) user.update({$pushAll: {ownedPosts: docs}}, (err, dbRes) => next(err, docs));
            else next(null, docs);
        });
    });
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteAndDissociate', function (docsID, user, next) {
    return extFn.normalization(docsID, user, next, (docsID, user, next) => {
        this.remove({_id: docsID}, err => {
            if (err) return next(err, null);
            if (user) user.update({$pullAll: {ownedPosts: docsID}}, (err, dbRes) => next(err, docsID));
            else next(null, docsID);
        });
    });
});


//// version counter (object method)
PostSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('POST', PostSchema);

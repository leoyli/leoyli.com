const
    mongoose                = require('mongoose');



// define new (DB)data schema
const
    PostSchema              = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    _pinTop                 : {type: Boolean, default: false},
    author                  : {
        _id                 :
            {
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'USER'
            },
        username            : String    // todo: nickname, and can be updated once changed
    },
    featured                : String,   // todo: featured by a video
    title                   : {type: String},  // todo: required: true
    class                   : {type: String, lowercase: true, default: 'unclassified'},
    tag                     : {type: String, lowercase: true},
    content                 : String
}, {
    timestamps              : {createdAt: '_created', updatedAt: '_updated'},
    versionKey              : '_revised'
});



// define new methods
const extFn                 = require('../config/extFn');

//// create and associate (model)
PostSchema.static('postsCreateAndAssociate', function (raw, user, next) {
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

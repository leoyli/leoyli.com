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
//// create and associate (model)
PostSchema.static('postsCreateAndAssociate', function (docs, user, next) {
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
        if (user) docs.map(self => self.author = user);
        this.create(docs, (err, docs) => {
            if (err) return next(err, null);
            if (user) user.update({$pushAll: {ownedPosts: docs}}, (err, docs) => next(err, docs));
            else next(err, docs);
        });
    })
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteAndDissociate', function (docsID, user, next) {
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
            if (user) user.update({$pullAll: {ownedPosts: docsID}}, (err, docs) => next(err, docs));
            else next(err, docsID);
        });
    })
});


//// version counter (object method)
PostSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('POST', PostSchema);

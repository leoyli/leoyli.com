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
PostSchema.static('postsCreateAndAssociate', function(user, docs, next) {
    // normalize & check
    if (typeof next !== 'function') next = (err, docs) => {return docs};
    if (!Array.isArray(docs)) docs = [docs];
    if (docs.length === 0 || !docs[0]) return next(); // todo: return error control

    // create & associate
    if (user) docs.map(self => self.author = user);
    return this.create(docs).then(docs => {
            if (user) user.update({$pushAll: {ownedPosts: docs}}).then(next(null, docs));
            else next(null, docs);
    });
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteAndDissociate', function(user, docsID, next) {
    // normalize & check
    if (typeof next !== 'function') next = () => {return null};
    if (!Array.isArray(docsID)) docsID = [docsID];
    if (docsID.length === 0 || !docsID[0]) return next(); // todo: return error control

    // remove and dissociate
    return this.remove({_id: docsID})
        .then(() => {
            if (user) user.update({$pullAll: {ownedPosts: docsID}}).then(next());
            else next();
        })
});


//// version counter (object method)
PostSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('POST', PostSchema);

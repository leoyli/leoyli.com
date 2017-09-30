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
//// creation and association (model)
PostSchema.statics.postsCreateAndAssociate = function(req, res, docs) {
    // normalize to an array
    if (!Array.isArray(docs)) docs = [docs];

    // associate with the author
    if (req.user) docs.map(self => self.author = req.user);

    // create doc(s)
    return this.create(docs)
        .then(createdPosts => {
            if (req.user) {
                // associate with the doc(s) // note: if statement prevents from unauthenticated crash
                req.user.ownedPosts = req.user.ownedPosts.concat(createdPosts);
                req.user.save();
            } return docs;
    });
};


//// todo: deletion and isolation (model)


//// version counter (object method)
PostSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('POST', PostSchema);

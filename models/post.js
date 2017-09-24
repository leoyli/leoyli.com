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
PostSchema.static('postsCreateAndAssociate', function  (req, res, docs, next) {
    // normalize to an array
    if (!Array.isArray(docs)) docs = [docs];

    // ignore if no data being passed
    if (docs.length === 0 || !docs[0]) return next();

    // associate with the uploader
    if (req.user) docs.map(self => self.author = req.user);

    // create doc(s)
    this.create(docs, function (err, createdPosts) {
        // associate with the doc(s) // note: if statement prevents from unSignIn crash
        if (req.user) {
            req.user.ownedPosts = req.user.ownedPosts.concat(createdPosts);
            req.user.save(err => next(err, createdPosts));
        } else return next(err, createdPosts);
    });
});


//// version counter (object method)
PostSchema.methods.reviseCounter = function () {
    ++this._revised;
    this.save();
};

// create a new model then export
module.exports = mongoose.model('POST', PostSchema);

const
    mongoose                = require('mongoose'),
    validator               = require('validator');


// define validation rules
function featured (value) {
    if (!value) return true;
    return validator.isURL(value);
}



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
            validator       : featured,
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
PostSchema.static('postsCreateAndAssociate', async function (raw, user, next) { // tofix: Promise bug
    return await (async (raw, user, next) => {
        if (user) raw.map(self => self.author = user);
        const docs = await this.create(raw);
        if (user) await user.update({$pushAll: {ownedPosts: docs}});
        return next(null, docs);
    })(...extFn.normalization(raw, user, next));
});


//// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
PostSchema.static('postsDeleteAndDissociate', function (docsID, user, next) {
    return (async (docsID, user, next) => {
        await this.remove({_id: docsID});
        await user.update({$pullAll: {ownedPosts: docsID}});
        return next(null, docsID);
    })(...extFn.normalization(docsID, user, next));
});


//// version counter (object method)
PostSchema.methods.reviseCounter = function() {
    ++this._revised;
    this.save();
};



// export model
module.exports = mongoose.model('POST', PostSchema);

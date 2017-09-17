const
    mongoose                = require('mongoose');



// define new (DB)data schema
var PostSchema              = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    _pinTop                 : {type: Boolean, default: false},
    author                  : {
        _id                  : {
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
PostSchema.methods.reviseCounter = function () {
    ++this._revised;
    this.save();
};

// create a new model then export
module.exports = mongoose.model('POST', PostSchema);

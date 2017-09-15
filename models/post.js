const
    mongoose                = require("mongoose");



// define new (DB)data schema
var PostSchema              = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    _pinTop                 : {type: Boolean, default: false},
    author                  : String,  /// will link user latter
    featuredImg             : String,
    title                   : {type: String},  /// need to handle errors latter on with flash  ///required: true
    class                   : {type: String, lowercase: true, default: "unclassified"},
    tag                     : {type: String, lowercase: true},
    content                 : String
}, {
    timestamps              : {createdAt: "_created", updatedAt: "_updated"},
    versionKey              : "_revised"
});

// define new methods
PostSchema.methods.reviseCounter = function () {
    ++this._revised;
    this.save();
};

// create a new model then export
module.exports = mongoose.model("Post", PostSchema);

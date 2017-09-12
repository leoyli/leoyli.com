var mongoose                = require("mongoose");


// define new (DB)data schema
var PostSchema              = new mongoose.Schema({
    _status                 : {type: Number, default: 0},
    _pinTop                 : {type: Boolean, default: false},
    postAuthor              : String,  /// will link user latter
    postFeaturedImg         : String,
    postTitle               : {type: String},  /// need to handle errors latter on with flash  ///required: true
    postClass               : {type: String, lowercase: true, default: "unclassified"},
    postTag                 : {type: String, lowercase: true},
    postContent             : String
}, {
    timestamps              : {createdAt: "_created", updatedAt: "_updated"},
    versionKey              : "_revised"
});

// define new methods
PostSchema.methods.increment = function () {
    ++this._revised;
    this.save();
};

// create a new model then export
module.exports = mongoose.model("Post", PostSchema);

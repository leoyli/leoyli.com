const
    mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");


// define new (DB)data schema
var UserSchema              = new mongoose.Schema({
    username                : {type: String}, ///required: true
    firstName               : {type: String}, ///required: true
    lastName                : {type: String}, ///required: true
    nickName                : {type: String}, ///required: true
    email                   : {type: String}, ///required: true
    birthday                : {type: Date},
    gender                  : {type: String},
    ownedPosts              :
        [{
            type            : mongoose.Schema.Types.ObjectId,
            ref             : "Post"
        }],
    _isGuest                : Boolean
}, {
    timestamps              : {createdAt: "_registered", updatedAt: "_updated"},
    versionKey              : false
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

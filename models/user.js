const
    mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');


// define new (DB)data schema
const
    UserSchema              = new mongoose.Schema({
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
            ref             : 'POST'
        }],
    ownedMedia              :
        [{
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'MEDIA'
        }],
    _isGuest                : Boolean
}, {
    timestamps              : {createdAt: '_registered', updatedAt: '_updated'},
    versionKey              : false
});

// define new methods
// methods from a plugin
UserSchema.plugin(passportLocalMongoose);



// create a new model then export
module.exports = mongoose.model('USER', UserSchema);

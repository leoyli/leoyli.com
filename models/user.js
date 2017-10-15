const
    mongoose                = require('mongoose'),
    validator               = require('validator'),
    passportLocalMongoose   = require('passport-local-mongoose');


// define new (DB)data schema
const
    UserSchema              = new mongoose.Schema({
    username                : {type: String, required: true},
    firstName               : {type: String, required: true},
    lastName                : {type: String, required: true},
    nickName                : {type: String},
    email                   : {type: String,
        validate: {
            isAsync         : false,
            validator       : validator.isEmail,
            message         : 'INVALID EMAIL ADDRESS',
        }},
    birthday                : {type: Date},
    gender                  : {type: String},
    ownedPosts: [{
        type                : mongoose.Schema.Types.ObjectId,
        ref                 : 'POST',
    }],
    ownedMedia: [{
            type            : mongoose.Schema.Types.ObjectId,
            ref             : 'MEDIA',
    }],
    _isActive               : {type: String, default: false},
}, {
    timestamps              : {createdAt: '_registered', updatedAt: '_updated'},
    versionKey              : false,
});



// define new methods
// methods from a plugin (object method)
UserSchema.plugin(passportLocalMongoose);



// export model
module.exports = mongoose.model('USER', UserSchema);

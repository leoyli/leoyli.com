const
    mongoose                = require('mongoose'),
    validator               = require('validator'),
    passportLocalMongoose   = require('passport-local-mongoose');



// define new (DB)data schema
const docLists              = new mongoose.Schema({
    posts: [{
        type                : mongoose.Schema.Types.ObjectId,
        ref                 : 'POST',
    }],
    media: [{
        type                : mongoose.Schema.Types.ObjectId,
        ref                 : 'MEDIA',
    }],
});

const UserSchema            = new mongoose.Schema({
    _isActive               : {type: String, default: false},
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
    docLists                : docLists,
}, {
    timestamps              : {createdAt: '_registered', updatedAt: '_updated'},
    versionKey              : false,
});



// define new methods
// methods from third-party plugin (object method)
UserSchema.plugin(passportLocalMongoose);



// export model
module.exports = mongoose.model('USER', UserSchema);

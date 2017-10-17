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
    username                : {type: String, unique: true, lowercase: true},
    email                   : {type: String, unique: true, required: true,
        validate: {
            isAsync         : false,
            validator       : validator.isEmail,
            message         : 'INVALID EMAIL ADDRESS',
        }},
    nickname                : {type: String},
    firstName               : {type: String, required: true},
    lastName                : {type: String, required: true},
    docLists                : docLists,
}, {
    timestamps              : {createdAt: '_registered', updatedAt: '_updated'},
    versionKey              : false,
});



// define new methods
// nickname assignment (pre-hook)
UserSchema.pre('save', function (next) {
    if (!this.nickname) this.nickname = `${this.firstName} ${this.lastName}`;
    next();
});


// methods from third-party plugin (object method)
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['username'],
    selectFields: ['_id', 'email', 'username', 'nickname', 'docLists'],
});



// export model
module.exports = mongoose.model('USER', UserSchema);

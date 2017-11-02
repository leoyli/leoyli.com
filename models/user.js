const
    mongoose                = require('mongoose'),
    validator               = require('validator'),
    passportLocalMongoose   = require('passport-local-mongoose');



// ==============================
//  SCHEMA
// ==============================
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
    _role                   : {type: String, default: 'admin'},
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
    picture                 : {type: String, required: true, default: ''},
    docLists                : docLists,
}, {
    timestamps              : {createdAt: '_registered', updatedAt: '_updated'},
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// nickname assignment (pre-hook)
UserSchema.pre('save', function (next) {
    if (!this.nickname) this.nickname = `${this.firstName} ${this.lastName}`;
    next();
});


// methods from third-party plugin (object method)
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['username'],
    selectFields: ['_id', 'email', 'username', 'nickname', 'picture', 'docLists'],
});



// export model
module.exports = mongoose.model('USER', UserSchema);

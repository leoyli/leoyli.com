const
    mongoose                = require('mongoose'),
    validator               = require('validator'),
    passportLocalMongoose   = require('passport-local-mongoose');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const { _$ }               = require('../controllers/modules/');



// ==============================
//  SCHEMA
// ==============================
const UserSchema            = new mongoose.Schema({
    username                : { type: String, unique: true, lowercase: true },
    email                   : { type: String, unique: true, required: true,
        validate: {
            isAsync         : false,
            validator       : validator.isEmail,
            message         : 'Invalid email address',
        }},
    nickname                : { type: String },
    firstName               : { type: String, required: true },
    lastName                : { type: String, required: true },
    picture                 : { type: String, required: true, default: '' },
    roles                   : { type: String, default: 'admin' },
    active                  : { type: String, default: false },
}, {
    timestamps              : { createdAt: 'time._registered', updatedAt: 'time._updated' },
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// nickname assignment (pre-hook)
UserSchema.pre('save', function () {
    if (this.nickname === undefined) this.nickname = `${this.firstName} ${this.lastName}`;
});


// methods from third-party plugin (object method)
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['username'],
    selectFields: ['_id', 'email', 'username', 'nickname', 'picture'],
});

//// rewrite plugin methods as promises
const _register = UserSchema.statics.register;
UserSchema.statics.register = function (doc, pw, next) {
    return _$.schema.promisify(_register, arguments, this);
};

const _authenticate = UserSchema.methods.authenticate;
UserSchema.methods.authenticate = function (pw, next) {
    return _$.schema.promisify(_authenticate, arguments, this);
};

const _changePassword = UserSchema.methods.changePassword;
UserSchema.methods.changePassword = function (old_PW, new_PW, next) {
    return _$.schema.promisify(_changePassword, arguments, this);
};



// export model
module.exports = mongoose.model('users', UserSchema);

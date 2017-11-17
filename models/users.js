const
    mongoose                = require('mongoose'),
    validator               = require('validator'),
    passportLocalMongoose   = require('passport-local-mongoose');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const _fn                   = require('../configurations/methods');



// ==============================
//  SCHEMA
// ==============================
const UserSchema            = new mongoose.Schema({
    _role                   : { type: String, default: 'admin' },
    _isActive               : { type: String, default: false },
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
}, {
    timestamps              : { createdAt: '_registered', updatedAt: '_updated' },
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
    selectFields: ['_id', 'email', 'username', 'nickname', 'picture'],
});

//// rewrite plugin methods as promises
const _register = UserSchema.statics.register;
UserSchema.statics.register = function (doc, pw, next) {
    return _fn.schema.promisify(_register, arguments, this);
};

const _authenticate = UserSchema.methods.authenticate;
UserSchema.methods.authenticate = function (pw, next) {
    return _fn.schema.promisify(_authenticate, arguments, this);
};

const _changePassword = UserSchema.methods.changePassword;
UserSchema.methods.changePassword = function (old_PW, new_PW, next) {
    return _fn.schema.promisify(_changePassword, arguments, this);
};



// export model
module.exports = mongoose.model('users', UserSchema);

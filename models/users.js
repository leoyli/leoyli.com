const
    mongoose                = require('mongoose'),
    validator               = require('validator'),
    passportLocalMongoose   = require('passport-local-mongoose');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const { _U_ }               = require('../controllers/utilities/');



// ==============================
//  SCHEMA
// ==============================
const UserSchema            = new mongoose.Schema({
    active                  : { type: String, default: false },
    roles                   : { type: String, default: 'admin' },
    username                : { type: String, unique: true, lowercase: true },
    email                   : { type: String, unique: true, required: true,
        validate: {
            isAsync         : false,
            validator       : validator.isEmail,
            message         : 'Invalid email address',
        }},
    nickname                : { type: String },
    picture                 : { type: String, required: true, default: '' },    // todo: added a validator
    info: {
        firstName           : { type: String, required: true },
        lastName            : { type: String, required: true },
        gender              : { type: String, required: true, enum: ['Male', 'Female', 'NA'], default: 'NA' },
        residence           : { type: String },
        timezone            : { type: String },
        birthday            : { type: Date },
    },
    time: {
        _lastTimeSignIn     : { type: Date },
    },
}, {
    timestamps              : { createdAt: 'time._registered', updatedAt: 'time._updated' },
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// nickname assignment (pre-hook)
UserSchema.pre('save', function () {
    if (this.nickname === undefined) this.nickname = `${this.info.firstName} ${this.info.lastName}`;
});

// methods for the document
UserSchema.methods.UpdateSignInLog = function () {
    return mongoose.connection.db.collection('users').update(
        { _id: this._id },
        { $set: { 'time._lastTimeSignIn': new Date(Date.now()) }}
    );
};

// methods from third-party plugin (object method)
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['username'],
    selectFields: ['_id', 'email', 'nickname', 'picture', 'info', 'time'],
});

//// rewrite plugin methods as promises
const _register = UserSchema.statics.register;
UserSchema.statics.register = function (doc, pw, next) {
    return _U_.schema.promisify(_register, arguments, this);
};

const _authenticate = UserSchema.methods.authenticate;
UserSchema.methods.authenticate = function (pw, next) {
    return _U_.schema.promisify(_authenticate, arguments, this);
};

const _changePassword = UserSchema.methods.changePassword;
UserSchema.methods.changePassword = function (old_PW, new_PW, next) {
    return _U_.schema.promisify(_changePassword, arguments, this);
};


// exports
module.exports = mongoose.model('users', UserSchema);

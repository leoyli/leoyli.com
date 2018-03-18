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
const UsersSchema           = new mongoose.Schema({
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
        residency           : { type: String },
        timezone            : { type: String },
        birthday            : { type: Date },
    },
    time: {
        _signIn             : { type: Date },
        _changePassword     : { type: Date },
    },
}, {
    timestamps              : { createdAt: 'time._registered', updatedAt: 'time._updated' },
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// nickname assignment (pre-hook)
UsersSchema.pre('save', function () {
    if (this.nickname === undefined) this.nickname = `${this.info.firstName} ${this.info.lastName}`;
});

// methods for the document
UsersSchema.methods.updateLastTimeLog = function (fieldName) {
    const field = `time._${fieldName}`;
    return mongoose.connection.db.collection('users').update(
        { _id: this._id },
        { $set: { [field]: new Date(Date.now()) }}
    );
};

// methods from third-party plugin (object method)
UsersSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['username'],
    selectFields: ['_id', 'email', 'nickname', 'picture', 'info', 'time'],
});

//// rewrite plugin methods as promises
function selfPromisify(fn, arg, THIS) {
    if (typeof arg[arg.length-1] === 'function') return fn.call(THIS, ...arg);
    return new Promise((resolve, reject) => fn.call(THIS, ...arg, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
    }));
}

const _register = UsersSchema.statics.register;
UsersSchema.statics.register = function (...arg) {
    return selfPromisify(_register, arg, this);
};

const _authenticate = UsersSchema.methods.authenticate;
UsersSchema.methods.authenticate = function (...arg) {
    return selfPromisify(_authenticate, arg, this);
};

const _changePassword = UsersSchema.methods.changePassword;
UsersSchema.methods.changePassword = function (...arg) {
    this.time._changePassword = new Date(Date.now());
    return selfPromisify(_changePassword, arg, this);
};


// exports
module.exports = mongoose.model('users', UsersSchema);

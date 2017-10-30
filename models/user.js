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
    selectFields: ['_id', 'email', 'username', 'nickname', 'picture', 'docLists'],
});


// // passport-local-mongoose method overwrite (into a Promise)
// const _authenticate = UserSchema.methods.authenticate;
// UserSchema.methods.authenticate = async function authenticate(password, next) {
//     await _authenticate.call(this, password, (err, result) => {
//         if (err) throw err;
//         if (typeof next === 'function') return next(err, result);
//         return result;
//     });
// };


// export model
module.exports = mongoose.model('USER', UserSchema);

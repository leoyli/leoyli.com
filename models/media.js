const
    mongoose                = require('mongoose');



// ==============================
//  FUNCTIONS
// ==============================
// ancillaries
const { _$ }               = require('../controllers/modules/');



// ==============================
//  SCHEMA
// ==============================
const MediaSchema           = new mongoose.Schema({
    author: {
        _id: {
            type            : mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        username            : { type: String },
    },
    file: {
        type                : { type: String },
        path                : { type: String },
        name                : { type: String },
    },
    title                   : { type: String, trim: true, required: [true, 'is required'] },
    description             : { type: String, trim: true, required: [true, 'is required'] },
    category                : { type: String, lowercase: true },
    tag                     : { type: String, lowercase: true },
}, {
    timestamps              : { createdAt: 'time.uploaded', updatedAt: 'time.updated' },
    versionKey              : '_revised',
});



// ==============================
//  STATIC METHODS
// ==============================
// create and associate (model)
MediaSchema.static('mediaCreateThenAssociate', function (raw, user, next) {
    return Promise.resolve().then(() => _$.schema.updateAndBind(raw, user, next, 'media', '$push', this));
});


// delete and dissociate (model)  // note: not workable for admin in deleting media owned by multiple users
MediaSchema.static('mediaDeleteThenDissociate', function (docsID, user, next) {
    return Promise.resolve().then(() => _$.schema.updateAndBind(docsID, user, next, 'media', '$pullAll', this));
});


// (pre-hook) version counter
MediaSchema.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $inc: { _revised: 1 }});
});



// export model
module.exports = mongoose.model('media', MediaSchema);

const
    mongoose                = require('mongoose');



// ==============================
//  SCHEMA
// ==============================
// todo: added CDN object for the header
let settingModelSchema      = new mongoose.Schema({
    title                   : { type: String, default: 'New Website' },
    description             : { type: String, default: 'n/a' },
    keywords                : { type: String, default: 'n/a' },
    time: {
        timezone            : { type: String, default: '' },
        format              : { type: String, default: 'default' }
    },
}, {
    timestamps              : { createdAt: 'time.created', updatedAt: 'time.updated' },
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// initialization (model)
settingModelSchema.static('dbInitialize', function(next) {
    return this.findOne({}, (err, loadConfig) => {
        if (!loadConfig) return this.create({}, next);
        if (typeof next === 'function') return next();
    });
});


// update settings (model)
settingModelSchema.static('updateSettings', function(dataToBeUpdated, next) {
    return this.findOneAndUpdate({}, dataToBeUpdated, { new: true }, next);
});



// export model
module.exports = mongoose.model('settings', settingModelSchema);

const
    mongoose                = require('mongoose');



// ==============================
//  SCHEMA
// ==============================
// todo: added CDN object for the header
const settingModelSchema      = new mongoose.Schema({
    active                  : { type: Boolean, default: false, unique: true },
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
settingModelSchema.static('initialize', async function(done) {
    return await this.findOne({ active: true }) ? done() : await this.create({ active: true }) ? done() : null;
});


// update settings (model)
settingModelSchema.static('updateSettings', function(dataToBeUpdated, next) {
    return this.findOneAndUpdate({}, dataToBeUpdated, { new: true }, next);
});



// export model
module.exports = mongoose.model('settings', settingModelSchema);

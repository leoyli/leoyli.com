const
    mongoose                = require('mongoose');



// ==============================
//  SCHEMA
// ==============================
// todo: added CDN object for the header
let _siteConfigSchema       = new mongoose.Schema({
    title                   : { type: String, default: 'New Website' },
    description             : { type: String, default: 'n/a' },
    keywords                : { type: String, default: 'n/a' },
    time: {
        timezone            : { type: String, default: '' },
        format              : { type: String, default: 'default' }
    },
    admin                   : String,
}, {
    timestamps              : { createdAt: '_created', updatedAt: '_updated' },
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// initialization (model)
_siteConfigSchema.static('siteInitialization', function() {
    this.findOne({}, (err, loadConfig) => {
        try {
            if (!loadConfig) this.create({});
        } catch (err) {
            throw new Error(`Failed in generating default configurations: \n${err.toString()}`);
        }
    });
});


// update settings (model)
_siteConfigSchema.static('updateSettings', function(dataToBeUpdated, next) {
    return this.findOneAndUpdate({}, dataToBeUpdated, { new: true }, next);
});



// export model
module.exports = mongoose.model('_SITECONFIG', _siteConfigSchema);

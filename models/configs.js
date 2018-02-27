const
    mongoose                = require('mongoose');



// ==============================
//  SCHEMA
// ==============================
const configModelSchema    = new mongoose.Schema({
    active                  : { type: Boolean, default: false, unique: true },
    title                   : { type: String, default: 'New Website' },
    description             : { type: String, default: 'n/a' },
    keywords                : { type: String, default: 'n/a' },
    sets: {
        imageTypes          : { type: [[String]], default: ['gif', 'jpe?g', 'png', 'svg', 'tiff', 'webp']},
        language            : { type: String, default: 'en' },
        timezone            : { type: String, default: '' },
        timeFormat          : { type: String, default: '' },
        sort                : { type: String, default: '' },
        num                 : { type: Number, default: 5 },
    },
}, {
    timestamps              : { createdAt: 'time.created', updatedAt: 'time.updated' },
    versionKey              : false,
});



// ==============================
//  STATIC METHODS
// ==============================
// initialization (model)
configModelSchema.static('initialize', async function(next = () => {}) {
    process.env['$WEBSITE_CONFIGS'] = JSON.stringify(await this.findOne({ active: true }));
    if (process.env['$WEBSITE_CONFIGS'] === 'null') {
        process.env['$WEBSITE_CONFIGS'] = JSON.stringify(await this.create({ active: true }));
    } return next();
});


// update settings (model)
configModelSchema.static('updateSettings', async function(doc, next = () => {}) {
    process.env['$WEBSITE_CONFIGS'] = JSON.stringify(await this.findOneAndUpdate({ active: true }, doc, { new: true }));
    return next();
});



// exports
module.exports = mongoose.model('settings', configModelSchema);

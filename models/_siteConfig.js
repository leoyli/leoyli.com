const
    mongoose                = require('mongoose');



// define new (DB)data schema   // todo: added CDN object for the header
let _siteConfigSchema       = new mongoose.Schema({
    title                   : {type: String, default: 'NEW WEBSITE'},
    description             : {type: String, default: ''},
    keywords                : {type: String, default: []},
    domain                  : {type: String, default: ''},
    time                    : {
        timezone            : {type: String, default: ''},
        format              : {type: String, default: 'default'}
    },
    admin                   : String
}, {
    timestamps              : {createdAt: '_created', updatedAt: '_updated'},
    versionKey              : false
});



// define new methods
//// initialization (model)
_siteConfigSchema.static('newSiteConfig', function () {
    let self = this;
    return self.findOne({}, function (err, loadConfig) {
        // error handler
        if (err) return console.log(err); // todo: error handling

        // default for a new site
        if (!loadConfig) self.create({});
    });
});


//// update settings (model)
_siteConfigSchema.static('updateSettings', function (dataToBeUpdated, next) {
    return this.findOneAndUpdate({}, dataToBeUpdated, {new: true}, next);
});



// export model
module.exports = mongoose.model('_SITECONFIG', _siteConfigSchema);
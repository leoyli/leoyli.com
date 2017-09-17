const
    mongoose                = require('mongoose');



// define new (DB)data schema   // todo: added CDN object for the header
var _siteConfigSchema       = new mongoose.Schema({
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



// define new methods (in preventing the callback hell)
_siteConfigSchema.static('newSiteConfig', function () {
    this.findOne({}, initializeSiteConfig);
});

function initializeSiteConfig (err, loadConfig) {
    if (err) return console.log(err);
    if (loadConfig === null) return _siteConfig.create({});
}


// new site registration on DB
var _siteConfig = mongoose.model('_SITECONFIG', _siteConfigSchema);
module.exports = _siteConfig;

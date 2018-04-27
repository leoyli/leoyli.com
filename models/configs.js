/* eslint-disable key-spacing */
const mongoose = require('mongoose');


// schema
const configsSchema  = new mongoose.Schema({
  active             : { type: Boolean, default: false, unique: true },
  title              : { type: String, default: 'New Website' },
  description        : { type: String, default: 'n/a' },
  keywords           : { type: String, default: 'n/a' },
  sets: {
    imageTypes       : { type: [[String]], default: ['gif', 'jpe?g', 'png', 'svg', 'tiff', 'webp'] },
    language         : { type: String, default: 'en' },
    timezone         : { type: String, default: '' },
    timeFormat       : { type: String, default: '' },
    sort             : { type: String, default: '' },
    num              : { type: Number, default: 5 },
  },
}, {
  timestamps         : { createdAt: 'time._created', updatedAt: 'time._updated' },
  versionKey         : false,
});


// static methods
configsSchema.static('initialize', async function configsSchema_initialize(next = () => {}) {
  process.env.$WEBSITE_CONFIGS = JSON.stringify(await this.findOne({ active: true }));
  if (process.env.$WEBSITE_CONFIGS === 'null') {
    process.env.$WEBSITE_CONFIGS = JSON.stringify(await this.create({ active: true }));
  } return next();
});

configsSchema.static('updateConfigs', async function configsSchema_updateConfigs(doc, next = () => {}) {
  process.env.$WEBSITE_CONFIGS = JSON.stringify(await this.findOneAndUpdate({ active: true }, doc, { new: true }));
  return next();
});


// exports
module.exports = mongoose.model('settings', configsSchema);

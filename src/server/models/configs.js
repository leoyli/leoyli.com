/* eslint-disable key-spacing */

const mongoose = require('mongoose');


// schema
const configsSchema  = new mongoose.Schema({
  initialized        : { type: Boolean, default: false },
  active             : { type: Boolean, default: false, unique: true },
  siteName           : { type: String, default: 'New Website' },
  description        : { type: String, default: 'n/a' },
  keywords           : { type: String, default: 'n/a' },
  sets: {
    imageTypes       : { type: [[String]], default: ['gif', 'jpe?g', 'png', 'svg', 'tiff', 'webp'] },
    language         : { type: String, default: 'en' },
    timezone         : { type: String, default: '' },
    timeFormat       : { type: String, default: '' },
    sort             : { type: String, default: '' },
    num              : { type: Number, default: 12 },
  },
}, {
  timestamps         : { createdAt: 'time._created', updatedAt: 'time._updated' },
  versionKey         : false,
});


// static methods
configsSchema.static('initConfig', async function configsSchema_initialize(app, cb) {
  const config = await this.findOne({ active: true });
  app.set('APP_CONFIG', config ? (await config.toObject()) : (await this.create({ active: true })).toObject());
  if (typeof cb === 'function') return cb();
});


configsSchema.static('updateConfig', async function configsSchema_updateConfig(req, doc, cb) {
  const config = await this.findOneAndUpdate({ active: true }, doc, { new: true });
  const result = { config, n: 1, nModified: 1, ok: 1 };
  req.app.set('APP_CONFIG', config.toObject());
  if (typeof cb === 'function') return cb(null, result);
  return Promise.resolve(result);
});


// exports
module.exports = mongoose.model('settings', configsSchema);

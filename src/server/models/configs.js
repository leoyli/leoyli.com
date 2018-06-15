/* eslint-disable key-spacing */
const mongoose = require('mongoose');


// schema
const configsSchema  = new mongoose.Schema({
  initialized        : { type: Boolean, default: false },
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
configsSchema.static('initConfig', async function configsSchema_initialize(app, cb) {
  const config = await this.findOne({ active: true });
  app.set('APP_CONFIG', config ? (await config.toObject()) : (await this.create({ active: true })).toObject());
  if (typeof cb === 'function') return cb();
});


configsSchema.static('updateConfig', async function configsSchema_updateConfig(app, doc, cb) {                          // todo: update lang (process.env)
  app.set('APP_CONFIG', (await this.findOneAndUpdate({ active: true }, doc, { new: true })).toObject());
  if (typeof cb === 'function') return cb();
});


// exports
module.exports = mongoose.model('settings', configsSchema);

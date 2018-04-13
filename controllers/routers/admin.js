module.exports = admin = {};



// modules
const { _M_ } = require('../middleware/plugins');
const { _U_ } = require('../utilities/');
const { configsModel, mediaModel, postsModel } = require('../../models/');
const { fetch } = require('../middleware/fetch');



// controllers
admin.main = {
  GET: (req, res, next) => next(),
};

admin.configs = {
  GET: (req, res, next) => {
    res.locals.$$VIEW.configs = JSON.parse(process.env['$WEBSITE_CONFIGS']);
    return next();
  },
  PATCH: async (req, res) => {
    await configsModel.updateSettings(req.body.configs);                                                            // tofix: pickup updated variables to avoid injections
    return res.redirect('back');
  },
};

admin.upload = {   // todo: to be integrated in profile and media manager
  GET: (req, res, next) => next(),
  POST: [_M_.hireBusboy({ fileSize: 25*1048576 }), async (req, res) => {
    if (req.body.busboySlip.mes.length > 0) req.body.busboySlip.mes.forEach(mes => req.flash('error', mes));
    if (req.body.busboySlip.raw.length > 0) {
      req.body.busboySlip.raw.forEach(medium => medium.author = req.session.user);
      const docs = await mediaModel.create(req.body.busboySlip.raw);
      if (docs.length > 0) req.flash('info', `${docs.length} file(s) successfully uploaded!`);
    }
    return res.redirect('back');
  }],
};

admin.stack = {
  GET: (req, res, next) => {
    const collection = req.params['stackType'].toLowerCase();
    if (['posts', 'media'].indexOf(collection) === -1) throw new _U_.error.HttpError(404);
    _M_.setTitleTag(collection)(req, res);                                                                              // todo: capitalize
    return fetch(collection, {num: 10})(req, res, next);
  },
  PATCH: async (req, res) => {
    const $update = { $set: {}};
    if (req.body.action === 'restored') $update.$set = { [`state.recycled`]: false };
    else $update.$set = { [`state.${req.body.action}`]: true };
    if (req.body.action) await postsModel.update({ _id: { '$in' : req.body.target }}, $update, { multi: true });
    return res.redirect('back');
  },
};

const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { configsModel, mediaModel, postsModel } = require('../../models/');



// controllers
module.exports = admin = {};

admin.main = {
  GET: function admin_main_GET(req, res, next) {
    return next();
  },
};

admin.configs = {
  GET: function admin_configs_GET(req, res, next) {
    res.locals.$$VIEW.configs = JSON.parse(process.env['$WEBSITE_CONFIGS']);
    return next();
  },
  PATCH: async function admin_configs_PATCH(req, res) {
    await configsModel.updateSettings(req.body.configs);                                                                // tofix: pickup updated variables to avoid injections
    return res.redirect('back');
  },
};

admin.upload = {                                                                                                        // todo: to be integrated in profile and media manager
  GET: function admin_upload_GET(req, res, next) {
    return next();
  },
  POST: [_M_.parseMultipart({ fileSize: 25*1048576 }), async function admin_upload_POST(req, res) {
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
  GET: function admin_stack_GET(req, res, next) {
    const collection = req.params['stackType'].toLowerCase();
    if (!['posts', 'media'].includes(collection)) throw new _U_.error.HttpError(404);
    _M_.modifyHTMLTitleTag(collection)(req, res);                                                                       // todo: capitalize
    return _M_.aggregateFetch(collection, {num: 10})(req, res, next);
  },
  PATCH: async function admin_stack_PATCH(req, res) {
    const $update = { $set: {}};
    if (req.body.action === 'restored') $update.$set = { [`state.recycled`]: false };
    else $update.$set = { [`state.${req.body.action}`]: true };
    if (req.body.action) await postsModel.update({ _id: { '$in' : req.body.target }}, $update, { multi: true });
    return res.redirect('back');
  },
};

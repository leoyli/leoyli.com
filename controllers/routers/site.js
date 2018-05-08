const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const { ConfigsModel, MediaModel, PostsModel } = require('../../models/');


// controllers
const site = {};


site.configs = {
  GET: function site_configs_GET(req, res, next) {
    res.locals.$$VIEW.configs = JSON.parse(process.env.$WEBSITE_CONFIGS);
    return next();
  },
  PATCH: async function site_configs_PATCH(req, res) {
    await ConfigsModel.updateConfigs(req.body.configs);                                                                 // tofix: pickup updated variables to avoid injections
    return res.redirect('back');
  },
};


site.upload = {                                                                                                         // todo: to be integrated in profile and media manager
  GET: function site_upload_GET(req, res, next) {
    return next();
  },
  POST: [_M_.parseMultipart({ fileSize: 25 * 1048576 }), async function site_upload_POST(req, res) {
    if (req.body.busboySlip.mes.length > 0) req.body.busboySlip.mes.forEach(mes => req.flash('error', mes));
    if (req.body.busboySlip.raw.length > 0) {
      req.body.busboySlip.raw.forEach(medium => { medium.author = req.session.user; });
      const docs = await MediaModel.create(req.body.busboySlip.raw);
      if (docs.length > 0) req.flash('info', `${docs.length} file(s) successfully uploaded!`);
    }
    return res.redirect('back');
  }],
};


site.stack = {
  GET: async function site_stack_GET(req, res, next) {
    const collection = req.params.stackType.toLowerCase();
    if (!['posts', 'media'].includes(collection)) throw new _U_.error.HttpException(404);
    return _U_.express.wrapMiddleware([
      _M_.modifyHTMLTitleTag(collection),
      _M_.aggregateFetch(collection, { num: 10 }),
    ])(req, res, next);
  },
  PATCH: async function site_stack_PATCH(req, res) {
    const $update = { $set: {} };
    if (req.body.action === 'restored') $update.$set = { 'state.recycled': false };
    else $update.$set = { [`state.${req.body.action}`]: true };
    if (req.body.action) await PostsModel.update({ _id: { $in: req.body.target } }, $update, { multi: true });
    return res.redirect('back');
  },
};


site.root = {
  GET: function site_main_GET(req, res, next) {
    return next();
  },
};


// exports
module.exports = site;

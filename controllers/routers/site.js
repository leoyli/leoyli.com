const { _M_ } = require('../modules/');
const { _U_ } = require('../utilities/');
const ModelIndex = require('../../models/');


// controllers
const site = {};


site.configs = {
  GET: function site_configs_GET(req, res, next) {
    res.locals.$$VIEW.configs = JSON.parse(process.env.$WEBSITE_CONFIGS);
    return next();
  },
  PATCH: async function site_configs_PATCH(req, res) {
    await ModelIndex.ConfigsModel.updateConfigs(req.body.configs);                                                      // tofix: pickup updated variables to avoid injections
    return res.redirect('back');
  },
};


site.upload = {                                                                                                         // todo: to be integrated in profile and media manager
  GET: function site_upload_GET(req, res, next) {
    return next();
  },
  POST: [_M_.parseMultipart({ fileSize: 25 * 1048576 }), async function site_upload_POST(req, res) {
    if (req.body.busboySlip.mes.length > 0) req.body.busboySlip.mes.map(mes => req.flash('error', mes));
    if (req.body.busboySlip.raw.length > 0) {
      const slip = req.body.busboySlip.raw;
      for (let i = slip.length - 1, media = slip[i]; i > -1; media = slip[i -= 1]) media.author = req.session.user;
      const docs = await ModelIndex.MediaModel.create(req.body.busboySlip.raw);
      if (docs.length > 0) req.flash('info', `${docs.length} file(s) successfully uploaded!`);
    }
    return res.redirect('back');
  }],
};


site.stack = {
  GET: async function site_stack_GET(req, res, next) {
    const collection = req.params.collection.toLowerCase();
    if (!['posts', 'media'].includes(collection)) throw new _U_.error.HttpException(404);
    //
    return _U_.express.wrapMiddleware([
      _M_.modifyHTMLTitleTag(collection),
      _M_.paginatedQuery(collection, { num: 10 }),
    ])(req, res, next);
  },
  PATCH: async function site_stack_PATCH(req, res) {
    const collection = req.params.collection.toLowerCase();
    if (!['posts', 'media'].includes(collection)) throw new _U_.error.HttpException(404);
    //
    const { action, target = [] } = req.body;
    if (action && target.length > 0) {
      const model = ModelIndex[`${_U_.string.toCapitalized(collection)}Model`];
      await model.update({ _id: { $in: target } }, { $set: { [`state.${action}`]: true } }, { multi: true });
    }
    return res.redirect('back');
  },
};


site.root = {
  GET: function site_main_GET(req, res, next) {
    return next();
  },
};


// exports
module.exports = { site };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});

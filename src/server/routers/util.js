const { _M_ } = require('../controllers/modules');
const { _U_ } = require('../utilities');
const ModelIndex = require('../models');


// controllers
const util = {};


util.stacks = {
  GET: async function util_stacks_GET(req, res, next) {
    const collection = req.params.collection.toLowerCase();
    if (!['posts', 'media'].includes(collection)) throw new _U_.error.HttpException(404);
    //
    return _M_.paginatedQuery(collection, { num: 10 })(req, res, next);
  },
  PATCH: async function util_stacks_PATCH(req, res, next) {
    const collection = req.params.collection.toLowerCase();
    if (!['posts', 'media'].includes(collection)) throw new _U_.error.HttpException(404);
    //
    const { action, target } = req.body;
    if (action && target.length) {
      const model = ModelIndex[`${_U_.string.toCapitalized(collection)}Model`];
      const result = await model.update(
        { _id: { $in: target.toString().split(',') } },
        { $set: { [`state.${action}`]: true } },
        { multi: true },
      );
      res.locals.data = { ...res.locals.data, result };
      return _M_.paginatedQuery(collection)(req, res, next);
    }
    return next();
  },
};


util.upload = {                                                                                                         // todo: to be integrated in profile and media manager
  POST: [_M_.streamingUploader({ fileSize: 25 * 1048576 }), async function util_upload_POST(req, res, next) {
    const { raw = [], mes = [] } = req.body.busboySlip;
    if (raw.length) {
      for (let i = raw.length - 1, doc = raw[i]; i > -1; doc = raw[i -= 1]) {
        doc.author = { _id: req.session.user.sub, nickname: 'admin' };
      }
      const media = await ModelIndex.MediaModel.create(raw);
      res.locals.data = { ...res.locals.data, media };
    }
    return next();
  }],
};


util.settings = {
  GET: function util_settings_GET(req, res, next) {
    res.locals.data = { ...res.locals.data, config: res.locals.config };
    return next();
  },
  PATCH: async function util_settings_PATCH(req, res, next) {
    const result = await ModelIndex.ConfigsModel.updateConfig(req, req.body.config);
    res.locals.data = { ...res.locals.data, result };
    return next();
  },
};


// exports
module.exports = { util };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});

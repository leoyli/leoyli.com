const { _M_ } = require('../modules/');
const modelIndex = require('../../models/');


// controllers
const api = {};

api.stack = {
  GET: async function API_stack_GET(req, res) {
    const collection = req.params.stackType.toLowerCase();
    if (!['posts', 'media'].includes(collection)) return res.sendStatus(404);
    return res.json(await _M_.aggregateFetch(collection, { num: 10 })(req, res));
  },
  PUT: async function API_stack_PUT(req, res) {                                                                         // todo: limit update range (matching with query)
    const collection = req.params.stackType.toLowerCase();
    const $update = { $set: {} };
    if (req.body.action === 'restored') $update.$set = { 'state.recycled': false };
    else $update.$set = { [`state.${req.body.action}`]: true };

    if (req.body.action && req.body.list.length > 0) {
      return modelIndex[`${collection}Model`]
        .update({ _id: { $in: req.body.list } }, $update, { multi: true })
        .then(() => res.json({ modified: true }))
        .catch(() => res.sendStatus(500));
    }
    return res.json({ modified: false });
  },
};


// exports
module.exports = api;

module.exports = api = {};



// modules
const { _M_ } = require('../middleware/');
const modelIndex = require('../../models/');



// controllers
api.stack = {
  GET: async (req, res) => {
    const collection = req.params['stackType'].toLowerCase();
    if (!['posts', 'media'].includes(collection)) res.statusCode(404);
    return res.json(await _M_.aggregateFetch(collection, { num: 10 })(req, res));
  },
  PUT: async (req, res) => {                                                                                            // todo: limit update range (matching with query)
    const collection = req.params['stackType'].toLowerCase();
    const $update = { $set: {} };
    if (req.body.action === 'restored') $update.$set = { [`state.recycled`]: false };
    else $update.$set = { [`state.${req.body.action}`]: true };

    if (req.body.action && req.body.list.length > 0) return modelIndex[`${collection}Model`]
      .update({ _id: { '$in' : req.body.list }}, $update, { multi: true })
      .then(() => res.json({ modified: true }))
      .catch(err => res.sendStatus(500));
    return res.json({ modified: false });
  },
};

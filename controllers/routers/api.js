module.exports = api = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { fetch } = require('../middleware/fetch');
const modelIndex = require('../../models/');


// ==============================
//  CONTROLLERS
// ==============================
api.stack = {
  GET: async (req, res) => {
    const collection = req.params['stackType'].toLowerCase();
    if (['posts', 'media'].indexOf(collection) !== -1) {
      return res.json(await fetch(collection, { num: 10 })(req, res));
    } else res.statusCode(404);
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
    else return res.json({ modified: false });
  },
};

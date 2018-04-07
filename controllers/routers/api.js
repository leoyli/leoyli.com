module.exports = api = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _U_ } = require('../utilities/');
const { fetch } = require('../middleware/fetch');



// ==============================
//  CONTROLLERS
// ==============================
api.stack = {
  GET: async (req, res) => {
    const collection = req.params['stackType'].toLowerCase();
    if (['posts', 'media'].indexOf(collection) !== -1) {
      return res.json(await fetch(collection, { num: 10 })(req, res));
    } else throw new _U_.error.HttpError(404);
  },
  PATCH: async (req, res) => {
    return res.json({ ok: true });
  },
  OPTIONS: async(req, res) => {
    res.set('Allow', 'GET, PATCH, OPTIONS');
    res.sendStatus(200);
  },
};

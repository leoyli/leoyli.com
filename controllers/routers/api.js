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
  get: async (req, res) => {
    const collection = req.params['stackType'].toLowerCase();
    if (['posts', 'media'].indexOf(collection) !== -1) {
      res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
      return res.json(await fetch(collection, { num: 10 })(req, res));
    } else throw new _U_.error.HttpError(404);
  },
};

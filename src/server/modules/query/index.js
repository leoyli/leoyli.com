const { _U_ } = require('../../utilities');
const { getAggregationQuery } = require('./pipes');
const modelIndex = require('../../models');


// middleware
/**
 * (factory) populate paginated query result via Mongo aggregation
 * @param {string} collection               - MongoDB collection name
 * @param {number} [num]                    - preset numbers of document per page
 * @param {object} [sort]                   - preset sorting configurations
 * @return {function}
 */
const paginatedQuery = (collection, { num, sort } = {}) => function queryController(req, res, next) {
  const Model = modelIndex[`${_U_.string.toCapitalized(collection)}Model`];
  const config = req.app.get('APP_CONFIG');
  return Model
    .aggregate(getAggregationQuery(collection, req.params, req.query, num || config.display.num, sort))
    .then(docs => docs[0])
    .then(result => {
      if (result) res.locals.data = { ...res.locals.data, ...result };
      if (result && result.list) res.locals.data.list = result.list.map(doc => Model.hydrate(doc));
      return next();
    })
    .catch(next);
};


// exports
module.exports = {
  paginatedQuery,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    getAggregationQuery,
    ...module.exports,
  },
});

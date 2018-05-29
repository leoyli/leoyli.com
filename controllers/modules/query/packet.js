const { _U_ } = require('../../utilities/');
const { getAggregationQuery } = require('./pipes');
const modelIndex = require('../../../models/');


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
  return Model
    .aggregate(getAggregationQuery(collection, req.params, req.query, num || res.locals.$$SITE.num, sort))
    .then(docs => docs[0])
    .then(result => {
      if (result) req.session.cache = result;
      if (result && result.list) req.session.cache.list = result.list.map(doc => Model.hydrate(doc));
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

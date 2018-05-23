const { _U_ } = require('../utilities/');
const modelIndex = require('../../models/');


// helpers
/**
 * compose a hashed object containing Mongo query expressions for pagination
 * @param {object} query                    - express.js query object
 * @param {number} [num]                    - preset numbers of document per page
 * @return {object}                         - a collection of Mongo expressions contains paginating variables
 */
const paginatedMetaExpression = (query, num = 10) => {
  const $$page = Math.trunc(query.page > 1 ? query.page : 1);
  const $$num = Math.trunc(query.num > 0 ? query.num : num);
  const $$end = { $ceil: { $divide: ['$count', $$num] } };
  const $$now = { $cond: { if: { $lt: [$$page, $$end] }, then: { $literal: $$page }, else: $$end } };
  return { page: $$page, num: $$num, end: $$end, now: $$now };
};


/**
 * compose Mongo query expression based on a time range from an array
 * @param {array} start                     - an array formatted as [YYYY, MM, DD]
 * @param {array} end                       - an array formatted as [YYYY, MM, DD]
 * @return {object}                         - part-of expression in $match stage
 */
const queryDateExpression = (start, end) => {
  if (!start || !end || start.length !== 3 || end.length !== 3) return null;
  const [A, Z] = [(start < end) ? start : end, (start < end) ? end : start];
  const [G, L] = [{ Y: A[0], M: A[1], D: A[2] }, { Y: Z[0], M: Z[1], D: Z[2] }];
  G.D = G.Y ? G.M ? G.D ? G.D : (G.D += 1) : (G.D += 1) : L.M && L.D ? L.D : (G.D += 1);
  G.M = G.Y ? G.M ? (G.M -= 1) : G.M : L.M ? L.M - 1 : G.M;
  G.Y = G.Y ? G.Y : L.Y;
  L.Y = L.M ? L.Y : (L.Y += 1);
  L.M = L.M && L.D ? (L.M -= 1) : L.M;
  L.D += 1;
  return { $gte: new Date(Date.UTC(G.Y, G.M, G.D)), $lt: new Date(Date.UTC(L.Y, L.M, L.D)) };
};


/**
 * parse date query into an date array
 * @param {string} str                      - query string
 * @return {array}                          - an array shaped as [[YYYY, MM, DD], [YYYY, MM, DD]]
 */
const parseQueryDate = (str) => {
  if (!str || !_U_.string.checkToStringTag(str, 'String')) return [];
  //
  const group = '((?:\\d{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2][0-9]|3[0-1])?)?)?)';
  const query = new RegExp(`^(?!-?\\/?$)${group}(?:-|\\/?$)${group}\\/?$`);
  const range = new RegExp('(\\d{4})(\\d{2})(\\d{2})');
  return (query.exec(str) || []).slice(1, 3)
    .map(date => range.exec(date.padEnd(8, '0')).slice(1, 4)
      .map(value => Number(value)));
};


/**
 * parse sorting query into fieldName-direction entries
 * @param {string} str                      - query string
 * @param {string} [order]                  - contains information about sorting direction
 * @param {number} [preset]                 - default sorting direction (as descending direction)
 * @return {array}                          - an array shaped as [[fieldName, direction], ...]
 */
const parseQuerySort = (str, order = '', preset = -1) => {
  if (!str || !_U_.string.checkToStringTag(str, 'String')) return [];
  //
  const entries = [];
  const flag = order.split(':')[1];
  const weight = flag === 'a' ? 1 : flag === 'd' ? -1 : 0;
  const item = str && str.split(',');
  for (let i = item.length - 1; i > -1; i -= 1) {
    const [field, directionFlag] = item[i].split(':');
    const fieldWeight = (Math.trunc(directionFlag) && (directionFlag > 0 ? 1 : -1))
        || (directionFlag === 'a' && 1)
        || (directionFlag === 'd' && -1)
        || (preset > 0 ? 1 : -1);
    entries.push([field.trim(), weight || fieldWeight]);
  }
  return entries.reverse();
};


// aggregations
/**
 * pull-pipeline stage 1: matching rules
 * @param {string} collection               - MongoDB collection name
 * @param {object} params                   - express.js param object
 * @param {object} query                    - express.js query object
 * @return {{$match}}
 */
const pullPipe_1_matching = (collection, params, query) => {
  const $match = params.search ? { $text: { $search: params.search } } : {};
  const _$$date = query.date ? queryDateExpression(...parseQueryDate(query.date)) : null;                               // tofix: query time zone problem
  if (_$$date) $match['time._created'] = _$$date;
  if (['posts', 'media', 'page'].includes(collection)) {
    $match['time._recycled'] = (params.collection && query.access === 'bin') ? { $ne: null } : { $eq: null };
    if (!params.collection) $match['state.published'] = true;
    if (!params.collection) $match['state.hidden'] = false;
  }
  return { $match };
};


/**
 * pull-pipeline stage 2: fields masking
 * @param {object} params                   - express.js param object
 * @return {{$project}}
 */
const pullPipe_2_masking = (params) => {
  const $project = {};
  const mask = ['content'];
  if (params.collection) mask.push('featured');
  for (let i = mask.length - 1; i > -1; i -= 1) $project[mask[i]] = 0;
  return { $project };
};


/**
 * pull-pipeline stage 3: fields sorting
 * @param {object} query                    - express.js query object
 * @param {object} [sort]                   - preset sorting configurations
 * @return {{$project}}
 */
const pullPipe_3_sorting = (query, sort = {}) => {
  const $sort = { 'state.pinned': -1, 'time._updated': -1, ...sort };
  const sortMap = new Map();
  Object.keys(query)
    .filter(key => ['sort', 'sort:a', 'sort:d'].includes(key))
    .forEach(rule => parseQuerySort(query[rule], rule).forEach(pair => sortMap.set(...pair)));
  //
  if (sortMap.has('pin'))       $sort['state.pinned']     = sortMap.get('pin');
  if (sortMap.has('time'))      $sort['time._updated']    = sortMap.get('time');
  if (sortMap.has('update'))    $sort['time._updated']    = sortMap.get('update');
  if (sortMap.has('post'))      $sort['time._created']    = sortMap.get('post');
  if (sortMap.has('author'))    $sort['author.nickname']  = sortMap.get('author');
  if (sortMap.has('title'))     $sort.title               = sortMap.get('title');
  if (sortMap.has('category'))  $sort.category            = sortMap.get('category');
  if (sortMap.has('tags'))      $sort.tags                = sortMap.get('tags');
  if (sortMap.has('revise'))    $sort._revised            = sortMap.get('revise');
  return { $sort };
};


/**
 * pull-pipeline stage 4: grouping with document counting
 * @return {{$group}}
 */
const pullPipe_4_grouping = () => {
  const $group = { _id: null, count: { $sum: 1 }, list: { $push: '$$ROOT' } };
  return { $group };
};


/**
 * pull-pipeline stage 5: paginating projection
 * @param {object} query                    - express.js query object
 * @param {number} num                      - preset numbers of document per page
 * @param {object} sort                     - preset sorting configurations
 * @return {{$project}}
 */
const pullPipe_5_paginating = (query, num, sort) => {
  const $$meta = paginatedMetaExpression(query, num);
  const $project = {
    _id: 0,
    list: { $slice: ['$list', { $multiply: [{ $add: [$$meta.now, -1] }, $$meta.num] }, $$meta.num] },
    meta: {
      count: '$count',
      num: { $literal: $$meta.num },
      now: $$meta.now,
      end: $$meta.end,
      sort: { $literal: pullPipe_3_sorting(query, sort).$sort },
      period: { $literal: query.date && queryDateExpression(...parseQueryDate(query.date)) },
    },
  };
  return { $project };
};


// const pushPipe_1_modifying = (body) => {
//   const _$$filter = { $filter: { input: '$list', as: 'doc', cond: {
//         $and: [{ $in: ['$$doc._id', [ObjectId('5ab33bec53da62203f81676d')] /** body.list.map(i => ObjectId(i)) **/] } /** ,additional matcher **/]}
//     }};
//   const _$$map = { $map: { input: _$$filter, as: 'doc', in: { $mergeObjects: ['$$doc', body] }}};
//   const $project = { list: _$$map };
//   return { $project };
// };
//
//
// const pushPipe_2_splitting = () => {
//   const $unwind = '$list';
//   return { $unwind };
// };
//
//
// const pushPipe_3_destructuring = () => {
//   const $replaceRoot = { newRoot: '$list' };
//   return { $replaceRoot };
// };
//
//
// const pushPipe_4_overwriting = (collection) => {
//   const $out = collection;                                                                                              // todo: note: <CURRENT MONGODB IS NOT SUPPORTED> current (v3.6): overwrite the whole collection (x)
//   return { $out };
// };


// query-builder
/**
 * combined all pipeline stages into an Mongo aggregation query
 * @param {string} collection               - MongoDB collection name
 * @param {object} params                   - express.js param object
 * @param {object} query                    - express.js query object
 * @param {number} num                      - preset numbers of document per page
 * @param {object} sort                     - preset sorting configurations
 * @return {array}                          - Mongo aggregation query
 */
const getAggregationQuery = (collection, params, query, num, sort/** , update **/) => {
  const pullDocuments = [
    pullPipe_1_matching(collection, params, query),
    pullPipe_2_masking(params),
    pullPipe_3_sorting(query, sort),
    pullPipe_4_grouping(),
    pullPipe_5_paginating(query, num, sort),
  ];

  // const pushDocuments = [
  //   ...pullDocuments,
  //   pushPipe_1_modifying(update),
  //   pushPipe_2_splitting(),
  //   pushPipe_3_destructuring(),
  //   pushPipe_4_overwriting(collection)
  // ];

  return pullDocuments;
  // return update ? pushDocuments : pullDocuments;
};


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
      req.session.cache = result;
      if (result.list) req.session.cache.list = result.list.map(doc => Model.hydrate(doc));
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
    paginatedMetaExpression,
    queryDateExpression,
    parseQueryDate,
    parseQuerySort,
    pullPipe_1_matching,
    pullPipe_2_masking,
    pullPipe_3_sorting,
    pullPipe_4_grouping,
    pullPipe_5_paginating,
    getAggregationQuery,
    ...module.exports,
  },
});

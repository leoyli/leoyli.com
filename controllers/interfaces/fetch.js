// const { ObjectId } = require('mongodb');
const modelIndex = require('../../models/');
const { _U_ } = require('../utilities/');


// helpers
/**
 * construct Mongo query expression based on a time range from an array
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
 * translate into an array that contains a time range from a string
 * @param {string} str                      - query string
 * @return {array}                          - an array formatted as [[YYYY, MM, DD], [YYYY, MM, DD]]
 */
const parseQueryDate = (str) => {
  const group = '((?:\\d{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2][0-9]|3[0-1])?)?)?)';
  const query = new RegExp(`^(?!-?\\/?$)${group}(?:-|\\/?$)${group}\\/?$`);
  const range = new RegExp('(\\d{4})(\\d{2})(\\d{2})');
  return !str && !_U_.string.checkToStringTag(str, 'String') ? [] : (query.exec(str) || []).slice(1, 3)
    .map(date => range.exec(date.padEnd(8, '0')).slice(1, 4)
      .map(value => Number(value)));
};


// aggregations
const pullPipe_1_matching = (collection, params, query) => {
  const $match = _U_.object.hasOwnKey(params, 'search') ? { $text: { $search: params.search } } : {};
  const _$$date = query.date ? queryDateExpression(...parseQueryDate(query.date)) : null;                               // tofix: query time zone problem
  if (_$$date) $match['time._created'] = _$$date;
  if (collection === 'posts') {
    if (!params.stackType) {
      $match['state.hidden'] = false;
      $match['state.published'] = true;
      $match['time._recycled'] = { $eq: null };
    } else $match['time._recycled'] = query.access === 'bin' ? { $ne: null } : { $eq: null };
  }
  return { $match };
};


const pullPipe_2_masking = (params) => {
  const _$$stackPicker = { content: 0, featured: 0 };
  const _$$contentMask = { content: 0 };
  const $project = params.stackType === 'posts' ? _$$stackPicker : _$$contentMask;
  return { $project };
};


const pullPipe_3_sorting = (sort = {}) => {
  const $sort = { 'state.pinned': -1, ...sort };
  if ($sort['time._updated'] !== 1) $sort['time._updated'] = -1;
  return { $sort };
};


const pullPipe_4_counting = () => {
  const $group = { _id: null, count: { $sum: 1 }, list: { $push: '$$ROOT' } };
  return { $group };
};


const pullPipe_5_paginating = (query, sort, page = 1, num = 10) => {
  const _$$page = (query.page > 1) ? Number.parseInt(query.page, 10) : page;
  const _$$num = (query.num > 0) ? Number.parseInt(query.num, 10) : num;
  const _$$end = { $ceil: { $divide: ['$count', _$$num] } };
  const _$$now = { $cond: { if: { $lt: [_$$page, _$$end] }, then: { $literal: _$$page }, else: _$$end } };
  const $project = {
    _id: 0,
    list: { $slice: ['$list', { $multiply: [{ $add: [_$$now, -1] }, _$$num] }, _$$num] },
    meta: {
      count: '$count',
      num: { $literal: _$$num },
      now: _$$now,
      end: _$$end,
      sort: { $literal: pullPipe_3_sorting(sort).$sort },
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
const getAggregationQuery = (collection, params, query, page, num, sort/** , update **/) => {
  const pullDocuments = [
    pullPipe_1_matching(collection, params, query),
    pullPipe_2_masking(params),
    pullPipe_3_sorting(sort),
    pullPipe_4_counting(),
    pullPipe_5_paginating(query, sort, page, num),
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
const aggregateFetch = (collection, { page, num, sort } = {}) => function fetchController(req, res, next) {
  const Model = modelIndex[`${_U_.string.toCapitalized(collection)}Model`];
  return Model
    .aggregate(getAggregationQuery(collection, req.params, req.query, page, num || res.locals.$$SITE.num, sort))
    .then(docs => docs[0])
    .then(result => {
      const output = result && _U_.string.checkToStringTag(result.list, 'Array')
        ? { ...result, list: result.list.map(doc => Model.hydrate(doc)) }
        : result;
      if (typeof next !== 'function') return output;
      req.session.chest = output;
      return next();
    })
    .catch(next);
};


// exports
module.exports = {
  aggregateFetch,
  [Symbol.for('__TEST__')]: {
    queryDateExpression,
    parseQueryDate,
    getAggregationQuery,
  },
};
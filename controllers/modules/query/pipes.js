const { paginatedMetaExpression, queryDateExpression, parseQueryDate, parseQuerySort } = require('./helpers');


// aggregation pipes
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
      period: { $literal: queryDateExpression(...parseQueryDate(query.date)) },
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


// exports
module.exports = {
  getAggregationQuery,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    pullPipe_1_matching,
    pullPipe_2_masking,
    pullPipe_3_sorting,
    pullPipe_4_grouping,
    pullPipe_5_paginating,
    ...module.exports,
  },
});

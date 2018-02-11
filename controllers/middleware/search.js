const { ObjectId } = require('mongodb');


/**
 * get search query
 * @param {object} params                  - Express.js `req.params` object which contains searching keywords
 * @param {object} query                   - Express.js `req.query` object which contains pagination parameters
 * @param {number} num                     - pagination display unit   - todo: set default num in `req.locals._site`
 * @param {number} page                    - pagination pin point
 * @param {object} sort                    - sorting parameters        - todo: sorting options in setting pages
 * @return {object} { post, meta }         - return sorted docs and searching meta(count, num, now, end)
 */
function getAggregationQuery(params, query, page = 1, num = 5, sort = { 'time.created': -1 }) {
    const $term = params.search ? { $text: { $search: params.search }} : params._id ? { id: ObjectId(params._id) } : {};
    const $page = (query['page'] > 1) ? parseInt(query['page']) : page;
    const $num = (query['num'] > 0) ? parseInt(query['num']) : num;
    const $sort = sort['time.created'] ? sort : Object.assign({}, sort, { 'time.created': -1 });

    // (runtime) query variables
    const end = { $ceil: { $divide: ['$count', $num] }};
    const now = { $cond: { if: { $lt: [$page, end] }, then: { $literal: $page }, else: end }};

    return [
        { $match: $term },
        { $sort: $sort },
        { $group: { _id: null, count: { $sum: 1 }, post: { $push: '$$ROOT' }}},                 //todo: author populate
        { $project: { _id: 0,
                post: { $slice: ['$post', { $multiply: [{ $add: [now, -1] }, $num] }, $num] },  //tofix: why first?
                meta: { count: '$count', num: { $literal: $num }, now, end }},
        },
    ];
}


// middleware
function search({ page, num, sort } = {}) {
    return (req, res, next) => require('../../models/index').postModel
        .aggregate(getAggregationQuery(req.params, req.query, page, num, sort))
        .then(docs => docs[0])
        .then(result => {
            if (typeof next !== 'function') return result;
            req.session.view = result;
            return next();
        })
        .catch(err => {
            if (typeof next !== 'function') throw err;
            else return next(err);
        });
}



// exports
module.exports = search;




function fetch({ page, num, sort } = {}) {
    return (req, res, next) => require('../../models/').postModel
        .aggregate(getAggregationQuery(req, page, num, sort))
        .then(docs => docs[0])
        .then(result => {
            if (typeof next !== 'function') return result;
            req.session._view = result;
            return next();
        })
}



// ==============================
//  COMPONENTS
// ==============================
/**
 * construct Mongo query expression for search operations
 * @param {object} req                     - Express.js request object which contains fetching parameters
 * @param {number|*} num                   - pagination display unit
 * @param {number} page                    - pagination pin point
 * @param {object} sort                    - sorting parameters        - todo: sorting options in setting pages
 * @return {object} { post, meta }         - sorted docs and fetching meta(count, num, now, end, date, sort)
 */
function getAggregationQuery(req, page, num, sort) {
    const { params = {}, query = {} } = req;

    // query expressions
    const $filter   = exp_matchFilter(params, query);
    const $mask     = exp_postFiledMask(params);
    const $sort     = exp_sortRule(sort);

    // pagination variable expressions
    const $page     = (query['page'] > 1) ? parseInt(query['page']) : page || 1;
    const $num      = (query['num'] > 0) ? parseInt(query['num']) : num || 10;
    const $end      = { $ceil: { $divide: ['$count', $num] }};
    const $now      = { $cond: { if: { $lt: [$page, $end] }, then: { $literal: $page }, else: $end }};

    return [
        { $match    : $filter },
        { $project  : $mask },
        { $sort     : $sort },
        { $group    : { _id: null, count: { $sum: 1 }, list: { $push: '$$ROOT' }}},                                     // todo: author populate
        { $project  : { _id: 0,
            list: { $slice: ['$list', { $multiply: [{ $add: [$now, -1] }, $num] }, $num] },
            meta: { count: '$count', num: { $literal: $num }, now: $now, end: $end, sort: { $literal: $sort },
                route: { $literal: req.baseUrl + req.path }, period: { $literal: $filter['time.updated'] || {} }}},
        },
    ];
}


/**
 * construct Mongo query expression (for $match)
 * @param {object} params                   - Express.js `req.params` object which contains fetching keywords
 * @param {object} query                    - Express.js `req.query` object which contains fetching parameters
 * @return {object}                         - full expression in $match stage
 */
function exp_matchFilter(params, query) {
    const $filter = params.hasOwnProperty('search')
        ? { $text : { $search: params.search }} : params.hasOwnProperty('category')
            ? { category : params.category } : {};

    if (query.date) $filter['time.updated'] = exp_dateRange(...getDateRangeArray(query.date));
    return { ...$filter, status: { $eq: 'published' }, 'visibility.hidden': false }
}

/**
 * field mask for posts collection
 * @param {object} params                   - Express.js `req.params` object which contains fetching keywords
 * @return {object}                         - full expression in $project stage
 */
function exp_postFiledMask(params) {
    const $stackPicker = { content: 0, featured: 0 };
    const $contentMask = { content: 0 };
    return params['stackType'] === 'posts' ? $stackPicker : $contentMask;
}

/**
 * construct Mongo query expression (for $sort)
 * @param sort {object}                     - object contains sorting parameters for the fetching results
 * @return {object}                         - part-of expression in $match stage
 */
function exp_sortRule(sort) {
    const $sort = Object.assign({ 'visibility.pinned': -1 }, sort || {});
    if ($sort['time.updated'] !== 1) $sort['time.updated'] = -1;
    return $sort;
}

/**
 * construct Mongo query expression based on a time range from an array
 * @param {array} A                         - an array formatted as [YYYY, MM, DD]
 * @param {array} Z                         - an array formatted as [YYYY, MM, DD]
 * @return {{$gte: Date, $lt: Date}}        - part-of expression in $match stage
 */
function exp_dateRange(A, Z) {
    if (Z < A) [A, Z] = [Z, A];
    const G = { Y: A[0], M: A[1], D: A[2] }, L = { Y: Z[0], M: Z[1], D: Z[2] };
    G.D = G.Y ? G.M ? G.D ? G.D : ++G.D : ++G.D : L.M && L.D ? L.D : ++G.D;
    G.M = G.Y ? G.M ? --G.M : G.M : L.M ? L.M - 1 : G.M;
    G.Y = G.Y ? G.Y : L.Y;
    L.Y = L.M ? L.Y : ++L.Y;
    L.M = L.M && L.D ? --L.M : L.M;
    L.D = ++L.D;
    return { $gte: new Date(Date.UTC(G.Y, G.M, G.D)), $lt : new Date(Date.UTC(L.Y, L.M, L.D)) };
}

/**
 * translate into an array that contains a time range from a string
 * @param {string} str                      - query string
 * @return {array}                          - an array formatted as [[YYYY, MM, DD], [YYYY, MM, DD]]
 */
function getDateRangeArray(str) {
    const groupExp = `((?:\\d{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2][0-9]|3[0-1])?)?)?)`;
    const queryExp = new RegExp(`^(?!-?\\/?$)${groupExp}(?:-|\\/?$)${groupExp}\\/?$`);
    const rangeExp = new RegExp('(\\d{4})(\\d{2})(\\d{2})');
    return !str ? [] : (queryExp.exec(str) || []).slice(1, 3)
        .map(date => rangeExp.exec(date.padEnd(8, '0')).slice(1, 4)
            .map(value => Number(value)));
}




// exports
module.exports = { fetch,
    _test: { getAggregationQuery, getDateRangeArray, exp_matchFilter, exp_postFiledMask, exp_dateRange, exp_sortRule }};
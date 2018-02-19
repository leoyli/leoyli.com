/**
 * construct Mongo query expression for search operations
 * @param {object} req                     - Express.js request object which contains searching parameters
 * @param {number|*} num                   - pagination display unit
 * @param {number} page                    - pagination pin point
 * @param {object} sort                    - sorting parameters        - todo: sorting options in setting pages
 * @return {object} { post, meta }         - sorted docs and searching meta(count, num, now, end, date, sort)
 */
function getAggregationQuery(req, page, num, sort = { 'time.updated': -1 }) {
    const $filter = getFilterExp(req);
    const $sort = getSortExp(sort, req.query);
    const $page = (req.query['page'] > 1) ? parseInt(req.query['page']) : page || 1;
    const $num = (req.query['num'] > 0) ? parseInt(req.query['num']) : num;
    const $end = { $ceil: { $divide: ['$count', $num] }};
    const $now = { $cond: { if: { $lt: [$page, $end] }, then: { $literal: $page }, else: $end }};

    return [
        { $match: $filter },
        { $sort: $sort },
        { $group: { _id: null, count: { $sum: 1 }, post: { $push: '$$ROOT' }}},                 // todo: author populate
        { $project: { _id: 0,
            post: { $slice: ['$post', { $multiply: [{ $add: [$now, -1] }, $num] }, $num] },
            meta: { count: '$count', num: { $literal: $num }, now: $now, end: $end, baseUrl: { $literal: req.baseUrl },
                sort: { $literal: $sort }, date: { $literal: $filter['time.updated'] || {} }}},
        },
    ];
}


/**
 * construct Mongo query expression (for $match)
 * @param {object} user                     - Passport.js log-in `user` object populated in Express.js `session` object // option: authenticated dependent query?!
 * @param {object} params                   - Express.js `req.params` object which contains searching keywords
 * @param {object} query                    - Express.js `req.query` object which contains searching parameters
 * @return {object}                         - full expression in $match stage
 */
function getFilterExp({ session: { user }, params, query } = { session: {} }) {
    const $filter = params.hasOwnProperty('search')
        ? { $text : { $search: params.search }} : params.hasOwnProperty('category')
            ? { category : params.category } : {};

    const range = getDateRangeArray(query.date);
    if (range.length === 2) $filter['time.updated'] = getDateRangeExp(range[0], range[1]);

    return { ...$filter, status: { $eq: 'published' }, 'visibility.hidden': false }
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


/**
 * construct Mongo query expression based on a time range from an array
 * @param {array} A                         - an array formatted as [YYYY, MM, DD]
 * @param {array} Z                         - an array formatted as [YYYY, MM, DD]
 * @return {{$gte: Date, $lt: Date}}        - part-of expression in $match stage
 */
function getDateRangeExp(A, Z) {
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
 * construct Mongo query expression (for $sort)
 * @param sort {object}                     - object contains sorting parameters for the searching results
 * @param {object} query                    - Express.js `req.query` object which contains searching parameters
 * @return {object}                         - part-of expression in $match stage
 */
function getSortExp(sort, query) {
    const $sort = Object.assign({ 'visibility.pinned': -1 }, sort);
    if ($sort['time.updated'] !== 1) $sort['time.updated'] = -1;
    return $sort;
}


// middleware
function search({ page, num, sort } = {}) {
    return (req, res, next) => require('../../models/index').postModel
        .aggregate(getAggregationQuery(req, page, num || res.locals._site.sets.num, sort))
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
module.exports = { find: search,
    _test: { getAggregationQuery, getFilterExp, getDateRangeArray, getDateRangeExp, getSortExp } };

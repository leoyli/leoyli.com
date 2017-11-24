// ==============================
//  FUNCTIONS
// ==============================
// extracted functions
function searchPosts(params, { num = 5, page = 1, sort = { 'time.created': -1 }} = {}) {
    // modify mongo query
    if (typeof params === 'string') params = { $text: { $search: params }};
    if (params && params.search) params = { $text: { $search: params.search }};

    // perform mongo query
    return require('../models').postModel.aggregate([
        { $match: params },
        { $sort: sort },
        { $group: { _id: null, count: { $sum: 1 }, post: { $push: '$$ROOT' }}}, // todo: .populate(author)
        { $project: { _id: 0, count: 1, post: 1, page: {
            last: { $ceil: { $divide: ['$count', num] }},
            this: { $cond: [                                                // note: construct pagination
                { $lt: [page, { $ceil: { $divide: ['$count', num] }}]},     // condition
                { $literal: page },                                         // truthy case
                { $ceil: { $divide: ['$count', num] }}                      // falsey case
            ]},
        }}},
        { $project: { count: 1, page: 1, post: { $slice: [                  // note: return paginated docs
            '$post',                                                        // data-field from the last pipeline
            { $multiply: [{ $add: ['$page.this', -1] }, num] },             // starting position
            num                                                             // pick up number
        ]}}}
    ]);
}



// ==============================
//  CONTROLLERS
// ==============================
const search = {};

search.find = ({ num = 5, page = 1, sort = {}, type } = {}) => (req, res, next) => {
    // todo: reset default of num from req.locals._site

    // modify mongo query
    if (req.query.num > 0) num = parseInt(req.query.num);
    if (req.query.page > 1) page = parseInt(req.query.page);
    if (!sort['time.created']) sort = Object.assign(sort, { 'time.created': -1 });     // todo: sorting options

    // perform mongo query
    return searchPosts(req.params, { num, page, sort }).then(result => {    // note: use promise.then for destructuring `page`
        const { count = 0, post = [], page } = result[0];

        // set prev/next meta tags
        const url = req.originalUrl.split('?')[0] + '?num=' + num + '&page=';
        if (page.this > 1) res.locals._view.prev = url + (page.this - 1);
        if (page.this < page.last) res.locals._view.next = url + (page.this + 1);

        // cache posts into user session
        req.session.view = { count, page, post: (type === 'singular') ? post[0] : post };
        return next();
    }).catch(err => next(err));
};



module.exports = { search };

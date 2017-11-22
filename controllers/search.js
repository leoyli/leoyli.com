// ==============================
//  FUNCTIONS
// ==============================
// middleware
const { _end }              = require('../configurations/middleware');

// extracted functions
function searchPosts(params, modifier) {
    let { num = 10, page = 1, sort = {} } = modifier;   // todo: read default value of num from req.locals._site

    // modify mongo $match query
    if (typeof params === 'string') params = { $text: { $search: params }};
    if (params && params.search) params = { $text: { $search: params.search }};

    // paginate
    const skip = (page > 1) ? ((page - 1) * num) : 0;

    return require('../models').postModel.aggregate([
        { $match: params },
        { $sort: sort },
        { $group: { _id: null, count: { $sum: 1 }, post: { $push: '$$ROOT' }}}, // todo: add .populate(author)
        { $project: { _id: 0, count: 1, post: { $slice: ['$post', skip, skip + num] }}}
    ]);
}



// ==============================
//  CONTROLLERS
// ==============================
const search = {};

search.find = modifier => _end.wrapAsync(async (req, res, next) => {
    // destructure query and default
    let { num = 10, page = 1, sort = {}, type } = modifier || {};   // todo: sorting options

    // modify mongo query
    if (type === 'singular') req.query = {};
    if (req.query.num > 0) num = parseInt(req.query.num);
    if (req.query.page > 1) page = parseInt(req.query.page);
    if (!sort['time.created']) sort = Object.assign(sort, { 'time.created': -1 });

    // perform mongo query
    const result = await searchPosts(req.params, { num, page, sort });
    const { count = 0, post = [] } = result[0];

    // todo: redirect 404 or the 1st page if req.query.page > max page
    // set prev/next meta tags
    const url = req.originalUrl.split('?')[0] + '?num=' + num + '&page=';
    if (page > 1) res.locals._view.prev = url + (page - 1);
    if (page < Math.ceil(count / num)) res.locals._view.next = url + (page + 1);

    // cache posts into user session
    req.session.view = { count, post: (type === 'singular') ? post[0] : post };
    next();
});



module.exports = { search };

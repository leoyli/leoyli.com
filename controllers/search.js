// ==============================
//  FUNCTIONS
// ==============================
// middleware
const { _pre, _end }        = require('../configurations/middleware');

// extracted functions
function findWithQueryModifier(params, query) {
    const { postModel } = require('../models');
    let {sort, num, page} = query;

    if (typeof params === 'string') params = { $text: { $search: params }};
    if (typeof params === 'object' && params.keywords) params = { $text: { $search: params.keywords }};
    if (!sort || !sort['time.created']) sort = Object.assign(sort || {}, { 'time.created': -1 });
    num = (num > 0) ? parseInt(num) : null;
    page = (page > 0) ? (parseInt(page) - 1) * num : null;

    return postModel.find(params).sort(sort).skip(page).limit(num); // todo: add .populate(author)
}



// ==============================
//  CONTROLLERS
// ==============================
const search = {};

search.find = query => _end.wrapAsync(async (req, res, next) => {
    if (query && query.type === 'singular') req.query = {}; // todo: remove when added split pages for a singular post
    if (query && query.num && !req.query.num) req.query.num = query.num;
    if (query && query.page && !req.query.page) req.query.page = query.page; // todo: if reach max page, the higher returned as 404
    const result = await findWithQueryModifier(req.params, req.query);

    // todo: added pagination in to 'header.dot'
    // req.locals._view.prev = {};
    // <link rel="prev" href="http://www.example.com/article-part1.html">
    // req.locals._view.next = {};
    // <link rel="next" href="http://www.example.com/article-part3.html">


    if (typeof next === 'function') {
        req.session.view = { post: (query.type === 'singular') ? result[0] : result };
        next();
    } else return result;
});



module.exports = { search };

// ==============================
//  FUNCTIONS
// ==============================
// middleware
const { _pre, _end }        = require('../configurations/middleware');

// extracted functions
function findPostWithQueryModifier(find, modifier) {
    const { postModel } = require('../models');
    let { sort, start, num } = modifier;

    if (typeof find === 'string') find = { $text: { $search: find }};
    if (!sort || !sort['time.created']) sort = Object.assign(sort || {}, {'time.created': -1});
    start = (start > 0) ? parseInt(start) : null;
    num = (num > 0) ? parseInt(num) : null;

    return postModel.find(find).sort(sort).skip(start).limit(num);
}



// ==============================
//  CONTROLLERS
// ==============================
const search = {};

search.find = _end.wrapAsync(async (req, res, next) => {
    const result = await findPostWithQueryModifier(Object.values(req.params)[0], req.query);

    if (typeof next === 'function') _end.next.postRender('./theme/search', result)(req, res);    // note: i.e. using as a middleware
    else return result;
});



module.exports = { search };

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
    if (!sort || !sort._created) sort = Object.assign(sort || {}, { _created : -1 });
    start = (start > 0) ? parseInt(start) : null;
    num = (num > 0) ? parseInt(num) : null;

    return postModel
        .find(find)
        .sort(sort)
        .skip(start)
        .limit(num);
}



// ==============================
//  CONTROLLERS
// ==============================
module.exports = _end.wrapAsync(async (req, res, next) => {
    const result = await findPostWithQueryModifier(Object.values(req.params)[0], req.query);

    if (typeof next === 'function') {   // note: i.e. using as a middleware
        req.session.view = { template: './theme/search', post: result };
        _end.next.postRender()(req,res);
    } else return result;
});

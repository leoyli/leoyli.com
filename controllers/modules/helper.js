const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');


/**
 * allow case insensitive accessing of `req.query`
 */
const caseInsensitiveQueryProxy = (req, res, next) => {
  req.query = _U_.object.createCaseInsensitiveProxy(req.query);
  return next();
};


/**
 * modify HTML title tag
 * @param {object|string} option            - modifying options
 * @param {string} option.tag               - title substring
 * @param {boolean} [option.extend = true]  - replace the whole string
 * @param {boolean} [option.append = false] - append title tag
 * @param {string} [option.delimiter = '-'] - delimiter used in conjunction
 */
const modifyHTMLTitleTag = (option) => function modifyHTMLTitleTagByOption(req, res, next) {
  if (res.locals.$$MODE === 'html') {
    const config = (_U_.string.checkToStringTag(option, 'String')) ? { tag: option } : option;
    const { tag, extend = true, append = false, delimiter = '-' } = config;

    // populate sequence
    const sequence = [];
    if (extend !== false) sequence.push(res.locals.$$VIEW.title);
    if (append === true) sequence.push(tag);
    else sequence.unshift(tag);

    res.locals.$$VIEW.title = sequence.join(` ${delimiter} `);
  }
  if (typeof next === 'function') return next();
};


// /**
//  * normalize body parser result
//  */
// const postNormalizer = async (req, res, next) => {
//   if (req.method === 'GET' || !req.body.post) return next();
//   const { post } = req.body;
//
//   // canonicalize                                                                                                       // todo: move to error handler
//   const checkAndResolveConflict = (str) => PostsModel
//     .count({ canonical: { $regex: new RegExp(`^${str}(?:-[0-9]+)?$`) } })
//     .then(counts => {
//       if (counts > 0) return `${str}-${counts + 1}`;
//       return str;
//     });
//
//   // normalize                                                                                                          // todo: only normalize for POST, PATCH (different logic)
//   const normalizedPost = {
//     ...post,
//     // featured: _U_.string.inspectFileURL(post.featured, res.locals.$$SITE.sets.imageTypes),                           // tofix: `inspectFileURL` have been deprecated
//     category: _U_.string.toKebabCase(post.category) || null,
//     content: _U_.string.toEscapedChars(post.content),
//     title: _U_.string.toEscapedChars(post.title),
//     tags: _U_.string.toKebabCase(post.tags) || null,
//   };
//   if (post.state) {
//     normalizedPost.state.forEach(state => {
//       normalizedPost[`state.${state}`] = true;
//     });
//   }
//   if (req.method === 'POST') {
//     normalizedPost.canonical = await checkAndResolveConflict(_U_.string.toKebabCase(post.title));
//   }
//
//   // overwrite
//   req.body.post = normalizedPost;
//
//   return next();
// };


// exports
module.exports = {
  caseInsensitiveQueryProxy,
  modifyHTMLTitleTag,
  // postNormalizer,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});

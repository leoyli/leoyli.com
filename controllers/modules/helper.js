const { _U_ } = require('../utilities/');
const { PostsModel } = require('../../models/');


/**
 * allow case insensitive accessing of `req.query`
 */
const caseInsensitiveProxy = (req, res, next) => {
  req.query = _U_.object.createCaseInsensitiveProxy(req.query);
  if (typeof next === 'function') return next();
};


/**
 * modify HTML title tag
 * @param {object} option                   - option for modifications
 */
const modifyHTMLTitleTag = (option) => function _modifyHTMLTitleTag(req, res, next) {
  if (res.locals.$$MODE !== 'html') return next();
  //
  const sequence = [];
  if (option.root !== false) sequence.push(res.locals.$$VIEW.title);
  if (option.append === true) sequence.push(option.name || option);
  else sequence.unshift(option.name || option);
  res.locals.$$VIEW.title = sequence.join(' - ');
  if (typeof next === 'function') return next();
};


/**
 * normalize body parser result
 */
const postNormalizer = async (req, res, next) => {
  if (req.method === 'GET' || !req.body.post) return next();
  const { post } = req.body;

  // canonicalize                                                                                                       // todo: move to error handler
  const checkAndResolveConflict = (str) => PostsModel
    .count({ canonical: { $regex: new RegExp(`^${str}(?:-[0-9]+)?$`) } })
    .then(counts => {
      if (counts > 0) return `${str}-${counts + 1}`;
      return str;
    });

  // normalize                                                                                                          // todo: only normalize for POST, PATCH (different logic)
  const normalizedPost = {
    ...post,
    // featured: _U_.string.inspectFileURL(post.featured, res.locals.$$SITE.sets.imageTypes),                           // tofix: `inspectFileURL` have been deprecated
    category: _U_.string.toKebabCase(post.category) || null,
    content: _U_.string.toEscapedChars(post.content),
    title: _U_.string.toEscapedChars(post.title),
    tags: _U_.string.toKebabCase(post.tags) || null,
  };
  if (post.state) {
    normalizedPost.state.forEach(state => {
      normalizedPost[`state.${state}`] = true;
    });
  }
  if (req.method === 'POST') {
    normalizedPost.canonical = await checkAndResolveConflict(_U_.string.toKebabCase(post.title));
  }

  // overwrite
  req.body.post = normalizedPost;

  return next();
};


// exports
module.exports = {
  caseInsensitiveProxy,
  modifyHTMLTitleTag,
  postNormalizer,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});

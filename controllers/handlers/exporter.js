const { _U_ } = require('../utilities/');
const { _M_ } = require('../modules/');


// magic-strings
const VIEW_POSTS_SINGLE = Symbol('VIEW_POSTS_SINGLE');
const VIEW_POSTS_MULTIPLE = Symbol('VIEW_POSTS_MULTIPLE');
const VIEW_STACK = Symbol('VIEW_STACK');


// renderer
const renderer = { posts: {} };

/**
 * #(factory) handle a single post document
 * @param {string} filename                 - template name
 * @param {object} [post]                   - post document
 * @param {object} [meta]                   - meta object
 * @return {string|*}
 */
renderer.posts.single = ({ filename, post = null, meta = {} } = {}) => function singlePostRenderer(req, res) {
  if (!post
      || post.state.recycled
      || (!post.state.published && !req.session.user)                                                                   // todo: wired up with authorization
  ) throw new _U_.error.HttpException(404);
  if (post.title) _M_.modifyHTMLTitleTag({ name: post.title, root: true })(req, res);
  return res.render(filename, { $$POST: post, $$META: meta });
};


/**
 * #(factory) handle a multiple post document list
 * @param {string} filename                 - template name
 * @param {array} [list]                    - list of post documents
 * @param {object} [meta]                   - meta object
 * @return {string|*}
 */
renderer.posts.multiple = ({ filename, list = [], meta = {} } = {}) => function multiplePostRenderer(req, res) {
  const paginatedURL = `${res.locals.$$VIEW.route}?num=${meta.num}&page='`;
  if (meta.now > 1) res.locals.$$VIEW.prev = paginatedURL + (meta.now - 1);
  if (meta.now < meta.end) res.locals.$$VIEW.next = paginatedURL + (meta.now + 1);
  return res.render(filename, { $$LIST: list, $$META: meta });
};


/**
 * (factory) export HTML string via proper renderer
 * @param {string} [$template]              - template name
 * @param {symbol} [$renderer]              - renderer symbol
 * @return {string|*}
 */
const exportHTML = ({ template: $template, renderer: $renderer } = {}) => function templateHandler(req, res) {
  const { post, list, meta, template = $template, renderer: renderingSymbol = $renderer } = req.session.chest
    ? req.session.chest
    : {};
  const filename = template && template.replace(/\/:([a-z0-9-$]+)$/i, (match, key) => `/${req.params[key]}`);
  delete req.session.chest;

  switch (renderingSymbol) {
    case VIEW_POSTS_SINGLE:
      return renderer.posts.single({ filename, post, meta })(req, res);
    case VIEW_POSTS_MULTIPLE:
    case VIEW_STACK:
      return renderer.posts.multiple({ filename, list, meta })(req, res);
    default: {
      return res.render(filename);
    }
  }
};


/**
 * (factory) export json document
 * @param {object} option                  - option (place holder)
 * @return {JSON|*}
 */
const exportJSON = (option) => function JSONHandler(req, res) {
  const doc = {
    ...(req.session.chest ? req.session.chest : {}),
    _execution_time: new Date(Date.now()).toISOString(),
    _cache: false,
  };
  delete req.session.chest;
  return res.json(doc);
};


// exports
module.exports = {
  exportHTML,
  exportJSON,
  rendererSymbols: {
    VIEW_POSTS_SINGLE,
    VIEW_POSTS_MULTIPLE,
    VIEW_STACK,
  },
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    renderer,
    ...module.exports,
  },
});

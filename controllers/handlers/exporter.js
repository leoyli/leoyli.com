const { _U_ } = require('../utilities/');
const { _M_ } = require('../modules/');


// magic-strings
const VIEW_POSTS_SINGLE = Symbol('VIEW_POSTS_SINGLE');
const VIEW_POSTS_MULTIPLE = Symbol('VIEW_POSTS_MULTIPLE');
const VIEW_STACK = Symbol('VIEW_STACK');


// renderer
const renderer = { posts: {} };

/**
 * (factory) handle a single post document
 * @return {string|*}
 */
renderer.posts.single = ({ template, post = {}, meta = {} } = {}) => function singlePostHandler(req, res) {
  if (!post.state
      || post.state.recycled
      || (!post.state.published && !req.session.user)                                                                 // todo: wired up with authorization
  ) throw new _U_.error.HttpException(404);
  if (post.title) _M_.modifyHTMLTitleTag({ name: post.title, root: true })(req, res);
  return res.render(template, { $POST: post, $$META: meta });
};


/**
 * (factory) handle a multiple post document list
 * @return {string|*}
 */
renderer.posts.multiple = ({ template, list = [], meta = {} } = {}) => function multiplePostHandler(req, res) {
  const paginatedURL = `${res.locals.$$VIEW.route}?num=${meta.num}&page='`;
  if (meta.now > 1) res.locals.$$VIEW.prev = paginatedURL + (meta.now - 1);
  if (meta.now < meta.end) res.locals.$$VIEW.next = paginatedURL + (meta.now + 1);
  return res.render(template, { $$LIST: list, $$META: meta });
};


// main handlers
/**
 * (factory) export HTML string with proper renderer
 * @return {string|*}
 */
const exportHTML = ({ template: $template, renderer: $renderer } = {}) => function templateLoader(req, res) {
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
 * export and clean up json file stored in a session
 * @return {JSON}
 */
const exportJSON = (req, res) => {
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

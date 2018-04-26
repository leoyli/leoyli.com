const { _U_ } = require('../utilities/');
const { _M_ } = require('../modules/');



// magic-strings
const VIEW_POSTS_SINGLE = Symbol();
const VIEW_POSTS_MULTIPLE = Symbol();
const VIEW_STACK = Symbol();



// handlers
const handler = { posts: {} };

handler.posts.single = (template, $$POST, $$META) => function singlePostHandler(req, res) {
  if ($$POST && $$POST.state && $$POST.state.recycled || !$$POST) throw new _U_.error.HttpError(404);
  else if (!req.session.user && $$POST.state && !$$POST.state.published) throw new _U_.error.HttpError(404);
  if ($$POST && $$POST.title) _M_.modifyHTMLTitleTag({ name: $$POST.title, root: true })(req, res);
  return res.render(template, { $$POST, $$META });
};

handler.posts.multiple = (template, $$LIST, $$META) => function multiplePostHandler(req, res) {
  if ($$META) {
    const paginatedURL = `${res.locals.$$VIEW.route}?num=${$$META.num}&page='`;
    if ($$META.now > 1) res.locals.$$VIEW.prev = paginatedURL + ($$META.now - 1);
    if ($$META.now < $$META.end) res.locals.$$VIEW.next = paginatedURL + ($$META.now + 1);
  }
  return res.render(template, { $$LIST, $$META });
};



// gateway
const templateHandler = ({ template: $template, handler: $handler }) => function templateHandler(req, res) {
  const { meta, post, list = [], template = $template } = req.session.chest ? req.session.chest : {};
  const filename = template.replace(/\/:([a-z0-9-$]+)$/i, (match, key) => `/${req.params[key]}`);
  delete req.session.chest;

  switch ($handler) {
    case VIEW_POSTS_SINGLE:
      return handler.posts.single(filename, post, meta)(req, res);
    case VIEW_POSTS_MULTIPLE:
    case VIEW_STACK:
      return handler.posts.multiple(filename, list, meta)(req, res);
    default: {
      return res.render(filename);
    }
  }
};



// exports
module.exports = { templateHandler, handlerSymbols: {
    VIEW_POSTS_SINGLE,
    VIEW_POSTS_MULTIPLE,
    VIEW_STACK,
  },
};

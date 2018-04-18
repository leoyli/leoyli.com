const { _U_ } = require('../utilities/');
const { _M_ } = require('../middleware/');



// gateway
const templateHandler = ({ template: $template, handler: $handler }) => function templateHandler(req, res) {
  const { template, list, post, meta } = req.session.chest ? req.session.chest : {};
  const filename = (template || $template).replace(/\/:([a-z0-9-$]+)$/i, (match, key) => `/${req.params[key]}`);
  delete req.session.chest;

  switch ($handler) {
    case 'posts.singular':
      return handler.posts.singular(filename, post, meta)(req, res);
    case 'posts.multiple':
      return handler.posts.multiple(filename, list || [], meta)(req, res);
    case 'stack':
      return handler.posts.multiple(filename, list || [], meta)(req, res);
    default: {
      return res.render(filename);
    }
  }
};



// handlers
const handler = { posts: {}};

handler.posts.singular = (template, $$POST, $$META) => function singlePostHandler(req, res) {
  if (!$$POST || $$POST && $$POST.state && $$POST.state.recycled) throw new _U_.error.HttpError(404);
  else if (!req.session.user && $$POST.state && !$$POST.state.published) throw new _U_.error.HttpError(404);
  if ($$POST && $$POST.title) _M_.modifyHTMLTitleTag($$POST.title, { root: true })(req, res);
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



// exports
module.exports = templateHandler;

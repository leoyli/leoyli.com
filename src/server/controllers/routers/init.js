const { _M_ } = require('../modules/');
const { PostsModel, UsersModel, ConfigsModel } = require('../../models/');


// seed
const seed = {
  user: {
    role: 'admin',
    username: 'admin',
    picture: '/static/default/admin_picture.png',
  },
  post: {
    title: 'Hello World!',
    content: 'Welcome to OpenBox CMS, this is your first post!',
  },
};


// controllers
const init = {
  GET: function init_GET(req, res, next) {
    if (req.app.get('APP_CONFIG').initialized) return res.redirect('/');
    return next();
  },
  POST: [_M_.isValidPasswordSyntax, async function init_POST(req, res, next) {
    if (req.app.get('APP_CONFIG').initialized) return res.redirect('/');
    const adminRaw = { ...req.body, ...seed.user, nickname: req.body.nickname || 'admin' };
    const admin = await UsersModel.register(new UsersModel(adminRaw), req.body.password.new);
    const config = ConfigsModel.updateConfig(req.app, { initialized: true });
    const post = PostsModel.create({ author: admin, ...seed.post });
    return req.logIn(admin, async (err) => {
      if (err) return next(err);
      admin.updateLastTimeLog('signIn');
      req.session.user = { _id: admin._id, picture: admin.picture, nickname: admin.nickname };
      req.flash('info', `Welcome ${admin.nickname || 'admin'}`);
      await Promise.all([post, config]);
      return res.redirect('/blog/hello-world');
    });
  }],
};


// exports
module.exports = { init };

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});

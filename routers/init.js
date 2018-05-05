/* eslint-disable key-spacing */
const { Device } = require('../controllers/engines/router');
const { PostsModel, UsersModel } = require('../models/');


// seed-data
const moc = {
  user: {
    email       : 'leo@leoyli.com',
    username    : 'leo',
    password    : 'leo',
    picture     : '/media/201801/1521405154605.png',
    info: {
      firstName : 'test',
      lastName  : 'test',
      residence : 'Test/test',
      timeZone  : 'UTC−07:00 (MST)',
      gender    : 'NA',
      birthday  : Date.now(),
    },
  },
  post: {
    title       : 'New arrived: Custom E-liter 4K!',
    featured    : 'http://www.perfectly-nintendo.com/wp-content/gallery/splatoon-2-13-10-2017/1.jpg',
    content     : 'New arrived: <strong>Custom E-liter 4K!</strong><script>alert("WARNING");</script>',
    category    : 'Splatoon 2',
  },
};


// controllers
const init = {
  GET: async function seed_GET(req, res) {
    const newUser = await UsersModel.register(new UsersModel(moc.user), moc.user.password);
    await PostsModel.create({ author: newUser, ...moc.post });
    req.flash('info', 'Successfully seeded.');
    res.redirect('/blog');
  },
};


// device
const initRouter = new Device([
  {
    route:        '/',
    controller:   init,
  },
]);


// exports
module.exports = initRouter;

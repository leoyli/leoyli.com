const { Device } = require('../controllers/engines/router');



// ==============================
//  CONTROLLERS
// ==============================
const moc = {
    user: {
        email       : 'leo@leoyli.com',
        username    : 'leo',
        password    : 'leo',
        picture     : '/media/201710/1509304639065.png',
        info: {
            firstName   : 'test',
            lastName    : 'test',
            residence   : 'Test/test',
            timeZone    : 'UTC−07:00 (MST)',
            gender      : 'NA',
            birthday    : Date.now(),
        }
    },
    post : function(newUser) { return {
        title       : 'New weapon arrived: Custom E-liter 4K!',
        author      : { _id: newUser._id, username: newUser.username },
        featured    : 'http://www.perfectly-nintendo.com/wp-content/gallery/splatoon-2-13-10-2017/1.jpg',
        content     : 'New arrived: <strong>Custom E-liter 4K!</strong><script>alert("WARNING");</script>',
    }}
};


const seed = async (req, res) => {
    const { postModel, userModel } = require('../models/');
    const newUser = await userModel.register(new userModel(moc.user), moc.user.password);
    await postModel.postsCreateThenAssociate(moc.post(newUser), newUser);
    req.flash('info', 'Successfully seeded.');
    res.redirect('/posts');
};



// ==============================
//  ROUTER HUB
// ==============================
const SeedRouter = new Device([{
    route: '/',
    controller: seed,
}]);



// router exports
module.exports = SeedRouter.run();

const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const { postModel, userModel } = require('../schema');



// ==============================
//  ROUTE RULES
// ==============================
// seed data
SEEDUSER = {
    email       : 'leo@leoyli.com',
    username    : 'leo',
    password    : 'leo',
    firstName   : 'Leo',
    lastName    : 'Li',
    picture     : '/media/201710/1509304639065.png'
};

SEEDPOST = {
    title       : 'New weapon arrived: Custom E-liter 4K!',
    author      : { _id: SEEDUSER._id, username: SEEDUSER.username },
    featured    : 'http://www.perfectly-nintendo.com/wp-content/gallery/splatoon-2-13-10-2017/1.jpg',
    content     : 'New arrived: <strong>Custom E-liter 4K!</strong><script>alert("WARNING");</script>',
};


// seed plant
router.get("/", async (req, res) => {
    req.user = await userModel.register(new userModel(SEEDUSER), SEEDUSER.password);
    await postModel.postsCreateThenAssociate(SEEDPOST, req.user);
    req.flash('info', 'Successfully seeded.');
    res.redirect('/post');
});


// error handler
router.use((err, req, res, next) => {
    req.flash('error', err.toString());
    res.redirect('back');
});



// route exports
module.exports  = router;

const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const UserModel             = require('../models/user');
const PostModel             = require('../models/post');



// ==============================
//  ROUTE RULES
// ==============================
// seed data
SEEDUSER = {
    username    : 'leo',
    firstName   : 'Leo',
    lastName    : 'Li',
    email       : 'leo@leoyli.com',
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
    console.log("NEW SAMPLE INJECTION STARTED:");
    const registeredUser = await UserModel.register(new UserModel(SEEDUSER), 'leo');
    console.log(`\n1) USER CREATED & SAVED:\n${registeredUser}`);
    req.user = registeredUser;
    const newPost = PostModel.postsCreateThenAssociate(SEEDPOST, req.user);
    console.log(`\n2) A SAMPLE HAVE INJECTED AND ASSOCIATED WITH THE USER:\n${newPost}`);
    req.flash('info', 'ALL SEEDED SUCCESSFULLY!');
    res.redirect('/post');
});


// error handler
router.use((err, req, res, next) => {
    req.flash('error', err.toString());
    res.redirect('back');
});



// route exports
module.exports  = router;

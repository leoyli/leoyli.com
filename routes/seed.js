// ** develop only ** //
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
};

SEEDPOST = {
    title       : 'New weapon arrived: Custom E-liter 4K!',
    author      : {_id: SEEDUSER._id, username: SEEDUSER.username},
    featured    : 'http://www.perfectly-nintendo.com/wp-content/gallery/splatoon-2-13-10-2017/1.jpg',
    content     : 'New arrived: <strong>Custom E-liter 4K!</strong><script>alert("WARNING");</script>',
};


// seed plant
router.get("/", (req, res) => {
    console.log("NEW SAMPLE INJECTION STARTED:");

    UserModel.register(new UserModel(SEEDUSER), 'leo', (err, registeredUser) => {
        if (err) return res.send(err);
        console.log(`\n1) USER CREATED & SAVED:\n${registeredUser}`);
        req.user = registeredUser;
        PostModel.postsCreateThenAssociate(SEEDPOST, req.user, (err, newPost) => {
            console.log(`\n2) A SAMPLE HAVE INJECTED AND ASSOCIATED WITH THE USER:\n${newPost}`);
            req.flash('info', 'ALL SEEDED SUCCESSFULLY!');
            res.redirect('/post');
        });
    });
});



// route exports
module.exports  = router;

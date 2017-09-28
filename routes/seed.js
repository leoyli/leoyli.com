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
    firstName   : 'leo',
    lastName    : 'li',
    email       : 'leo@leoyli.com'
};

SEEDPOST = {
    title       : 'TEST POST',
    author      : {_id: SEEDUSER._id, username: SEEDUSER.username},
    featured    : 'https://truth.bahamut.com.tw/s01/201708/33711956c380acf29d83d2c8321458f7.JPG',
    content     : '<strong>Splatoon 2</strong> UPCOMING UPDATES! <script>alert("WARNING");</script>'
};


// seed plant
router.get("/", (req, res) => {
    console.log("NEW SAMPLE INJECTION STARTED:");

    // seed a new user(obj.)
    UserModel.register(new UserModel(SEEDUSER), 'leo', (err, registeredUser) => {
        if (err) return res.send(err);
        console.log('\n 1) USER CREATED & SAVED:');
        console.log(registeredUser);
        req.user = registeredUser;
        PostModel.postsCreateAndAssociate(req, res, SEEDPOST, (err, newPost) => {
            if (err) return res.send(err);  // todo: hide from user
            console.log('\n 2) A SAMPLE HAVE INJECTED AND ASSOCIATED WITH THE USER:');
            console.log(newPost);
            res.redirect('/seed/check');
        });
    });
});


// seed check
router.get('/check', (req, res) => {
    console.log('\n 3) ASSOCIATION CHECKING:');
    UserModel.findOne({username: 'leo'}).populate('ownedPosts').exec((err, foundUser) => {
        if (err) return console.log(err);
        console.log(foundUser);
        res.send(foundUser);
    });
});



// route exports
module.exports  = router;

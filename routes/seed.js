// ** develop only ** //

var express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
var UserModel               = require('../models/user'),
    PostModel               = require('../models/post');



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
router.get("/", function (req, res) {
    console.log("NEW SAMPLE INJECTION STARTED:");

    // seed a new user(obj.)
    UserModel.register(new UserModel(SEEDUSER), 'leo', function (err, registeredUser) {
        if (err) return res.send(err);
        console.log('\n 1) USER CREATED & SAVED:');
        console.log(registeredUser);

        // if succeed, then seed a new post(obj.)
        PostModel.create(SEEDPOST, function (err, createdPost) {
            if (err) return res.send(err);
            console.log('\n 2) A SAMPLE HAVE INJECTED:');
            console.log(createdPost);

            // if succeed, then associate user & post
            UserModel.findOne({username: 'leo'}, function (err, foundUser) {
                if (err) return res.send(err);
                foundUser.ownedPosts.push(createdPost);
                foundUser.save(function (err, pushedUser) {
                    if (err) return res.send(err);
                    console.log('\n 3) THE NEW POST HAVE ASSOCIATED WITH THE USER:');
                    console.log(pushedUser);
                    res.redirect('/seed/check');
                });
            });
        });
    });
});


// seed check
router.get('/check', function (req, res) {
    console.log('\n 4) ASSOCIATION CHECKING:');
    UserModel.findOne({username: 'leo'}).populate('ownedPosts').exec(function (err, foundUser) {
        if (err) return console.log(err);
        console.log(foundUser);
        res.send(foundUser);
    });
});



// route exports
module.exports  = router;

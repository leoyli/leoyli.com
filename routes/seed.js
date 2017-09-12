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
router.get("/", function (req, res) {
    console.log("NEW SAMPLE INJECTION STARTED:");

    // seed a new user(obj.)
    UserModel.register(new UserModel({
        username: 'leo',
        firstName: 'leo',
        lastName: 'li',
        email: 'leo@leoyli.com'
    }), 'password', function (err, registeredUser) {
        if (err) {
            console.log('1.5) ERRORS! (@USER REGISTRATION)');
            console.log(err);
            return res.send(err);
        }
        console.log('\n 1) USER CREATED & SAVED:');
        console.log(registeredUser);

        // if succeed, then seed a new post(obj.)
        PostModel.create({
            postTitle: 'TEST POST',
            postFeaturedImg: 'https://truth.bahamut.com.tw/s01/201708/33711956c380acf29d83d2c8321458f7.JPG',
            postAuthor: 'LEO',
            postContent: '<strong>Splatoon 2</strong> UPCOMING UPDATES! <script>alert("WARNING");</script>'
        }, function (err, createdPost) {
            if (err) {
                console.log('\n 2) ERRORS! (@CREATE INJECTION)');
                console.log(err);
                return res.send(err);
            } else {
                console.log('\n 2) A SAMPLE HAVE INJECTED:');
                console.log(createdPost);

                // if succeed, then associate user & post
                UserModel.findOne({username: 'leo'}, function (err, foundUser) {
                    if (err) {
                        console.log('\n 2.5) ERRORS! (@FIND THE USER)');
                        console.log(err);
                        return res.send(err);
                    } else {
                        foundUser.ownedPosts.push(createdPost);
                        foundUser.save(function (err, pushedUser) {
                            if (err) {
                                console.log('\n 3) ERRORS! (ASSOCIATE USER DATA)');
                                console.log(err);
                                return res.send(err);
                            } else {
                                console.log('\n 3) THE NEW POST HAVE ASSOCIATED WITH THE USER:');
                                console.log(pushedUser);
                                console.log('\n INJECTION COMPLETED.');
                                res.redirect('/seed/check');
                            }
                        });
                    }
                });
            }
        });
    });
});


router.get('/check', function (req, res) {
    console.log('\n 4) ASSOCIATION CHECKING:');
    UserModel.findOne({username: 'leo'}).populate('ownedPosts').exec(function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundUser);
            res.send(foundUser);
        }
    });
});


// route exports
module.exports  = router;

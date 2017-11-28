const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const { postModel, userModel } = require('../models');



// ==============================
//  FUNCTIONS
// ==============================
// middleware
const { _md } = require('../controllers/middleware');



// ==============================
//  ROUTE RULES
// ==============================
// seed data
const SEEDUSER = {
    email       : 'leo@leoyli.com',
    username    : 'leo',
    password    : 'leo',
    firstName   : 'Leo',
    lastName    : 'Li',
    picture     : '/media/201710/1509304639065.png'
};

const SEEDPOST = {
    title       : 'New weapon arrived: Custom E-liter 4K!',
    author      : { _id: SEEDUSER._id, username: SEEDUSER.username },
    featured    : 'http://www.perfectly-nintendo.com/wp-content/gallery/splatoon-2-13-10-2017/1.jpg',
    content     : 'New arrived: <strong>Custom E-liter 4K!</strong><script>alert("WARNING");</script>',
};


// seed plant
router.get("/", _md.wrapAsync(async (req, res) => {
    const newUser = await userModel.register(new userModel(SEEDUSER), SEEDUSER.password);
    await postModel.postsCreateThenAssociate(SEEDPOST, newUser);
    req.flash('info', 'Successfully seeded.');
    res.redirect('/post');
}));


// error handler
router.use(require('../controllers/render').errorHandler);



// route exports
module.exports  = router;

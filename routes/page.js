const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  MODELS
// ==============================
const { postModel }         = require('../models');



// ==============================
//  FUNCTIONS
// ==============================
// middleware
const { _pre, _end }        = require('../configurations/middleware');

// controller
const { search }            = require('../controllers/search');


// ==============================
//  ROUTE RULES
// ==============================
// landing
router.get('/', (req, res) => res.render('./theme/index'));


// searching
router.get('/search/:TERMS', _pre.doNotCrawled, search.find);

// router.get('/tag/:TAG', _end.wrapAsync(async (req, res) => {
//     const result = await postModel.find({ tag: req.params.TAG }).sort({ _created : -1 });
//     _end.next.postRender('./theme/search', result)(req, res);
// }));

// router.get('/:CLASS', _end.wrapAsync(async (req, res) => {
//     const result = await postModel.find({ category: req.params.CLASS }).sort({ _created : -1 });
//     _end.next.postRender('./theme/search', result)(req, res);
// }));



// route exports
module.exports = router;
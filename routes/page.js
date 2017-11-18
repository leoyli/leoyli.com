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



// ==============================
//  ROUTE RULES
// ==============================
// landing
router.get('/', (req, res) => res.render('./theme/index'));


// searching
router.get('/search/:KEYWORDS', _pre.doNotCrawled, _end.wrapAsync(async (req, res) => {
    const keywords = req.params.KEYWORDS;
    const query = req.query;
    const result = await postModel.find({ $text: { $search: keywords }}).sort({ _created : -1 });
    _end.next.postRender('./theme/search', result)(req, res);
}));

// router.get('/tag/:TAG', _end.wrapAsync(async (req, res) => {
//     const result = await postModel.find({ tag: req.params.TAG }).sort({ _created : -1 });
//     _end.next.postRender('./theme/search', result)(req, res);
// }));

// router.get('/:CLASS', _end.wrapAsync(async (req, res) => {
//     const result = await postModel.find({ class: req.params.CLASS }).sort({ _created : -1 });
//     _end.next.postRender('./theme/search', result)(req, res);
// }));



// route exports
module.exports = router;

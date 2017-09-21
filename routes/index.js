const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  ROUTE RULES
// ==============================
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// route exports
module.exports = router;

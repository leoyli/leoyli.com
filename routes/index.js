const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  ROUTE RULES
// ==============================
router.get('/', (req, res) => {
    res.render('index');
});



// route exports
module.exports = router;

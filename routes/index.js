const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  ROUTE RULES
// ==============================
router.get('/', (req, res) => {
    res.render('./theme/index');
});



// route exports
module.exports = router;

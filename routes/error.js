const
    express                 = require('express'),
    router                  = express.Router();



// ==============================
//  ERRORS CONTROL
// ==============================
// catch 404 and forward to error handler
router.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// route exports
module.exports  = router;

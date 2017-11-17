module.exports = (app) => {
    // global middleware
    app.use(require('../configurations/middleware')._global);

    // seed
    if (process.env.ENV === 'dev' || 'test') app.use('/seed', require('../routes/seed'));

    // functional
    app.use('/console', require('../routes/console'));
    app.use('/post', require('../routes/post'));
    app.use('/', require('../routes/authentication'));
    app.use('/', require('../routes/page'));

    // error
    app.use('/', require('../routes/error'));
};

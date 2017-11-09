const { userModel } = require("./../schema");



// passport configurations
module.exports = (app, passport) => {
    // strategy is configured using passport-local-mongoose
    passport.use(userModel.createStrategy());

    // serialize & deserialize
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());

    // related app configs
    app.use(require('express-session')({
        secret: process.env.PASSPORT_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

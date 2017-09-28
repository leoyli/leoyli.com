const UserModel = require("./../models/user");



// passport configurations
module.exports = (app, passport) => {
    // strategy is configured using passport-local-mongoose
    passport.use(UserModel.createStrategy());

    // serialize & deserialize
    passport.serializeUser(UserModel.serializeUser());
    passport.deserializeUser(UserModel.deserializeUser());

    // related app configs
    app.use(require('express-session')({
        secret: process.env.PASSPORT_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

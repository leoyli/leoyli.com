const { userModel } = require("./../schema");



// passport configurations
module.exports = (app, passport) => {
    // strategy is configured using passport-local-mongoose
    passport.use(userModel.createStrategy());

    // serialize & deserialize
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());

    // related app configs
    app.use(passport.initialize());
    app.use(passport.session());
};

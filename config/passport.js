const { userModel } = require("./../schema");



// passport configurations
module.exports = (passport) => {
    // strategy is configured using passport-local-mongoose
    passport.use(userModel.createStrategy());

    // serialize & deserialize
    passport.serializeUser(userModel.serializeUser());
    passport.deserializeUser(userModel.deserializeUser());
};

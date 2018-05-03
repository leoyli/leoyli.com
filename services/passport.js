const { UsersModel } = require('../models/');


// main
const passportAgent = (passport) => {
  passport.use(UsersModel.createStrategy());
  passport.serializeUser(UsersModel.serializeUser());
  passport.deserializeUser(UsersModel.deserializeUser());
};


// exports
module.exports = passportAgent;

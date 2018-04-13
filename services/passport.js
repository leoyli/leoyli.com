const { usersModel } = require('../models/');



// main
const passportAgent = (passport) => {
  passport.use(usersModel.createStrategy());
  passport.serializeUser(usersModel.serializeUser());
  passport.deserializeUser(usersModel.deserializeUser());
};



// exports
module.exports = passportAgent;

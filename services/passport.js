const { usersModel } = require('../models/');


function passportAgent(passport) {
  passport.use(usersModel.createStrategy());
  passport.serializeUser(usersModel.serializeUser());
  passport.deserializeUser(usersModel.deserializeUser());
}



// exports
module.exports = passportAgent;

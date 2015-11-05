var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      nameField: 'name',
      passwordField: 'password' 
    },
    function(name, password, done) {
      User.findOne({
        name: name.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { success: false, message: 'This name is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { success: false, message: 'This password is not correct.' });
        }
        return done(null, user);
      });
    }
  ));
};
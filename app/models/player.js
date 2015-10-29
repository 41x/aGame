var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  /* User model structure */
});

module.exports = mongoose.model('User', UserSchema);
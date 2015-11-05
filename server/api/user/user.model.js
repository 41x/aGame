'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt     = require('bcrypt-nodejs');
var Card = require('../card/card.model');
var Deck = require('../deck/deck.model');

var UserSchema   = new Schema({
  name: { 
    type: String, 
    required: true, 
    index: { unique: true }
  },
  role: {
    type: String,
    default: 'user'
  },
  password: { 
    type: String, 
    required: true, 
  },
  decks:  [Deck],
  wins: {
    type: Number,
    default: 0
  },
  games: {
    type: Number,
    default: 0
  },
});

UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'wins': this.wins,
      'games': this.games
    };
  });

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

UserSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

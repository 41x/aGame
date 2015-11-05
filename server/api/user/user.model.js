'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt     = require('bcrypt-nodejs');
var Card = require('../card/card.model').Card;
var DeckSchema = require('../deck/deck.model').DeckSchema;

var UserSchema   = new Schema({
  name: { 
    type: String, 
    required: true, 
  },
  role: {
    type: String,
    default: 'user'
  },
  password: { 
    type: String, 
    required: true, 
  },
  decks:  [DeckSchema],
  wins: {
    type: Number,
    default: 0
  },
  games: {
    type: Number,
    default: 0
  },
});

/*
* Virtuals
*/
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

/*
* Validations
*/
UserSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');

UserSchema
  .path('password')
  .validate(function(password) {
    return password.length;
  }, 'Password cannot be blank');

UserSchema
  .path('name')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({name: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(String(self._id) == String(user._id)) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified name is already in use.');

/*
* Pre-save
*/
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

module.exports.User = mongoose.model('User', UserSchema);

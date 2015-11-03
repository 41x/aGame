'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt     = require('bcrypt-nodejs');
var Card = require('../card/card.model');

var DeckSchema   = new Schema({
  name: { 
    type: String, 
    required: true, 
  },
  cards: {
    type: [{
      count: {
        type: Number,
        default: 1
      },
      card: {
        type: Schema.Types.ObjectId, 
        ref: 'Card'
      }
    }],
    validate: [ deckLimit, '{PATH} exceeds the limit of 30' ]
  }
});

function deckLimit(val) {
  var sum = 0;
  for (var i = 0; i < val.length; i++) {
    sum += val[i].count;
  }
  return sum <= 30;
};

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
    select: false 
  },
  decks:  [DeckSchema]
});

UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
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

UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Deck = mongoose.model('Deck', DeckSchema);
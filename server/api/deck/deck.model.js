'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Card = require('../card/card.model').Card;

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

module.exports.Deck = mongoose.model('Deck', DeckSchema);
module.exports.DeckSchema = DeckSchema;
'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DeckSchema   = new Schema({
  name: { 
    type: String, 
    required: true, 
  }
});


module.exports = mongoose.model('Deck', DeckSchema);
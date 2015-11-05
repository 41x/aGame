'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CardSchema   = new Schema({
  name: { 
    type: String, 
    required: true, 
    index: { unique: true }
  },
  power: [String],
  health: Number,
  attack: Number,
  img: String
});

module.exports.Card = mongoose.model('Card', CardSchema);
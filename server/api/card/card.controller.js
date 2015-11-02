'use strict';

var Card = require('./card.model');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

module.exports.index = function(req, res) {
    Card.find(function(err, cards) {
      if(err) return res.status(500).send(err);
      res.status(200).json(cards);
    });
};

module.exports.create = function(req, res) {
  var card = new Card();

  card.name = req.body.name;
  card.health = req.body.health;
  card.attack = req.body.attack;

  card.save(function(err, card) {
    if (err) validationError(res, err);
    res.json({ message: 'Card created!' });
  });
};

module.exports.show = function(req, res) {
  var cardId = req.params.id;

  Card.findById(cardId, function(err, card) {
    if (err) return validationError(res, err);
    if (!card) return res.status(401).send('No such card');
    res.json(card);
  });
};

module.exports.destroy = function(req, res) {
  var cardId = req.params.id;

  Card.findByIdAndRemove(cardId, function(err, card) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

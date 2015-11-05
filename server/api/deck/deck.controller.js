'use strict';

var User = require('../user/user.model').User;
var Card = require('../card/card.model').Card;
var Deck = require('../deck/deck.model').Deck;
var jwt = require('jsonwebtoken');


var validationError = function(res, err) {
  return res.status(422).json(err);
};

/*
*  User's Decks Operations
*/

module.exports.indexDeck = function(req, res) {
  res.json(req.user.decks);
};

module.exports.createDeck = function(req, res) {
  req.user.decks.push({name: req.body.name});
  req.user.save(function(err) {
    if (err) validationError(res, err);
    res.json({ message: 'Deck created!' });
  });
};

module.exports.showDeck = function(req, res) {
  req.user.decks.id(req.params.deckId)
    .populate('cards')
    .exec(function(err, deck) {
      res.json(deck);
    });
};

module.exports.destroyDeck = function(req, res) {
  req.user.decks.pull({ _id: req.params.deckId});

  req.user.save(function(err) {
    if (err) validationError(res, err);
    res.json({ message: 'Deck destroied!' });
  });
};

/*
* Deck's Cards Operations
*/

module.exports.addCard = function(req, res) {
    Card.findById(req.params.cardId, function(err, card) {
      if (err) return validationError(res, err);
      if (!card) return res.status(401).send('No such card');
      
      var deck = req.user.decks.id(req.params.deckId);
      if (!deck) return res.status(401).send('No Deck');

      var isExists = false;

      deck.cards.forEach(function(el) {
        if (String(el.card) == String(card._id)) {
          isExists = true;
          el.count += 1;
        }
      });

      if (!isExists) deck.cards.push({ card: card._id });

      req.user.save(function(err) {
        if (err) return validationError(res, err);
        res.json({ message: 'Card added' });
      })
    });
};

module.exports.remCard = function(req, res) {
    Card.findById(req.params.cardId, function(err, card) {
      if (err) return validationError(res, err);
      if (!card) return res.status(401).send('No such card');

      var deck = req.user.decks.id(req.params.deckId);
      if (!deck) return res.status(401).send('No Deck');

      deck.cards.forEach(function(el) {
        if (String(el.card) == String(card._id)) {
          if (el.count > 1) 
            el.count -= 1;
          else
            deck.cards.pull(el);
        }
      });

      req.user.save(function(err) {
        if (err) return validationError(res, err);
        console.log(err);
        res.json({ message: 'Card deleted' });
      })
    });
};

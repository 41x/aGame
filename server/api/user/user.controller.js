'use strict';

var User = require('./user.model').User;
var Card = require('../card/card.model');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/*
* Users Operations
*/
module.exports.index = function(req, res) {
    User.find(function(err, users) {
      if(err) return res.status(500).send(err);
      res.status(200).json(users);
    });
};

module.exports.create = function(req, res) {
  if ((!req.body.name && req.body.password))
    return validationError(res, err);

  var user = new User();

  user.name = req.body.name;
  user.password = req.body.password;
  user.role = 'user';

  user.save(function(err, user) {
    if (err) validationError(res, err);
    res.json({ message: 'User created!' });
  });
};

module.exports.show = function(req, res) {
  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    if (err) return validationError(res, err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

module.exports.destroy = function(req, res) {
  var userId = req.params.id;

  User.findByIdAndRemove(userId, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

module.exports.me = function(req, res) {
  User.find({ _id: req.user._id })
    .populate('decks.cards.card')
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send('Unauthorized2');

      res.json(user);
    });
};

/*
*  User's Decks Operations
*/

module.exports.indexDeck = function(req, res) {
  res.json(req.user.decks);
};

module.exports.createDeck = function(req, res) {
  req.user.decks.push({name: req.body.deckName});
  
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

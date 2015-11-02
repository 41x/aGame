'use strict';

var User = require('./user.model').User;
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

module.exports.index = function(req, res) {
    User.find(function(err, users) {
      if(err) return res.status(500).send(err);
      res.status(200).json(users);
    });
};

module.exports.create = function(req, res) {
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

};

/*
* TODO: Изменить, добави только для текущего пользователя, прикрепленного к req
*/

var findUser = function(req, res, callback) {
  User.findById(req.params.id, function (err, user) {
    if (err) return validationError(res, err);
    if (!user) return res.status(401).send('Unauthorized');
    callback(user);
  }); 
};

module.exports.indexDeck = function(req, res) {
  findUser(req, res, function(user){
    res.json(user.decks);
  });
};

module.exports.createDeck = function(req, res) {
  findUser(req, res, function(user) {
    user.decks.push({name: req.body.deckName});
    
    user.save(function(err) {
      if (err) validationError(res, err);
      res.json({ message: 'Deck created!' });
    });
  });
};

module.exports.showDeck = function(req, res) {
  findUser(req, res, function(user){
    res.json(user.decks.id(req.params.deckId));
  });
};

module.exports.destroyDeck = function(req, res) {
  findUser(req, res, function(user){
    user.decks.pull({ _id: req.params.deckId});

    user.save(function(err) {
      if (err) validationError(res, err);
      res.json({ message: 'Deck destroied!' });
    });
  });
};

var findDeck = function(req, res, callback) {
  findUser(req, res, function(user){
    var deck = user.decks.id(req.params.deckId);

    if (!deck) return res.status(401).send('No Deck');
    callback(deck)
  });
};


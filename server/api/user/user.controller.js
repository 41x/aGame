'use strict';

var User = require('./user.model').User;
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
    return validationError(res, { message: 'No parameters' });

  var user = new User();

  user.name = req.body.name;
  user.password = req.body.password;
  user.role = 'user';
  user.save(function(err, user) {
    if (err) return validationError(res, err);
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


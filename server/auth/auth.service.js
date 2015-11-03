'use strict';

var mongoose      = require('mongoose');
var passport      = require('passport');
var jwt           = require('jsonwebtoken');
var expressJwt    = require('express-jwt');
var compose       = require('composable-middleware');
var config        = require('../config');

var User = require('../api/user/user.model').User;
var validateJwt = expressJwt({ secret: config.secret });

module.exports.isAuthenticated = function isAuthenticated() {
  return compose()
    .use(function(req, res, next) {
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

        req.user = user;
        next();
      });
    });
};

module.exports.hasRole = function hasRole (roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
};

module.exports.signToken = function signToken(id) {
    return jwt.sign({ _id: id }, config.secret, { expiresInMinutes: 60*5 });
};

module.exports.setTokenCookie = function setTokenCookie(req, res) {
  if (!req.user) 
    return res.status(404).json({ message: 'Something went wrong.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
};
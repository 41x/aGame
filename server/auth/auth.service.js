'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var User = require('../api/user/user.model');

module.exports.isAuthenticated = function() {

};

module.exports.hasRole = function(roleRequired) {

};

module.exports.signToken = function(id) {

};

module.exports.setTokenCookie = function(req, res) {
  if (!req.user) 
    return res.status(404).json({ message: 'Something went wrong.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
};
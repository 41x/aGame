'use strict';

var express    = require('express'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    path       = require('path');

var app = express();
var config = require('./app/config.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);
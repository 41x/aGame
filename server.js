'use strict';

var express    = require('express'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    path       = require('path');

var app = express();
var config = require('./server/config.js');

mongoose.connect(config.database); 

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


app.use('/api/users', require('./server/api/user/user.route'));
app.use('/api/cards', require('./server/api/card/card.route'));

app.route('/*')
  .get(function(req, res) {
    res.send('nope');
  });

app.listen(config.port);
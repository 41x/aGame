'use strict';

var express    = require('express'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    path       = require('path'),
    passport   = require('passport'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser');
var app = express();
var config = require('./server/config.js');

mongoose.connect(config.database); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(passport.initialize());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

require('./server/routes')(app);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(config.port);
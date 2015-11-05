'use strict';

var path = require('path');

module.exports = function(app) {
  app.use('/api/users', require('./api/user/user.route'));
  app.use('/api/decks', require('./api/deck/deck.route'));
  app.use('/api/cards', require('./api/card/card.route'));


  app.use('/auth', require('./auth'));
};

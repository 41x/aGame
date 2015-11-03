'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var userRouter = express.Router();

userRouter.get('/', auth.isAuthenticated(), controller.index);
userRouter.delete('/:id', auth.hasRole('admin'), controller.destroy);
userRouter.get('/me', auth.isAuthenticated(), controller.me);
userRouter.get('/:id', auth.isAuthenticated(), controller.show);
userRouter.post('/', controller.create);

var deckRouter = express.Router();

deckRouter.get('/', auth.isAuthenticated(), controller.indexDeck);
deckRouter.post('/', auth.isAuthenticated(), controller.createDeck);
deckRouter.get('/:deckId', auth.isAuthenticated(), controller.showDeck);
deckRouter.delete('/:deckId', auth.isAuthenticated(), controller.destroyDeck);

deckRouter.post('/:deckId/cards/:cardId', auth.isAuthenticated(), controller.addCard);
deckRouter.delete('/:deckId/cards/:cardId', auth.isAuthenticated(), controller.remCard);

module.exports.userRouter = userRouter;
module.exports.deckRouter = deckRouter;
'use strict';

var express = require('express');
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

var router = express.Router({mergeParams: true});


router.get('/', auth.isAuthenticated(), controller.index);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);

router.get('/:id/decks', auth.isAuthenticated(), controller.indexDeck);
router.post('/:id/decks', auth.isAuthenticated(), controller.createDeck);
router.get('/:id/decks/:deckId', auth.isAuthenticated(), controller.showDeck);
router.delete('/:id/decks/:deckId', auth.isAuthenticated(), controller.destroyDeck);

router.post('/:id/decks/:deckId/cards/:cardId', auth.isAuthenticated(), controller.addCard);
router.delete('/:id/decks/:deckId/cards/:cardId', auth.isAuthenticated(), controller.remCard);

module.exports = router;
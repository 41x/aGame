'use strict';

var express = require('express');
var controller = require('./deck.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.indexDeck);
router.post('/', auth.isAuthenticated(), controller.createDeck);
router.get('/:deckId', auth.isAuthenticated(), controller.showDeck);
router.delete('/:deckId', auth.isAuthenticated(), controller.destroyDeck);

router.post('/:deckId/cards/:cardId', auth.isAuthenticated(), controller.addCard);
router.delete('/:deckId/cards/:cardId', auth.isAuthenticated(), controller.remCard);


module.exports = router;

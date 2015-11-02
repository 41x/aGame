'use strict';

var express = require('express');
var controller = require('./user.controller');
var router = express.Router({mergeParams: true});


router.get('/', controller.index);
router.delete('/:id', controller.destroy);
router.get('/me', controller.me);
router.get('/:id', controller.show);
router.post('/', controller.create);

router.get('/:id/decks', controller.indexDeck);
router.post('/:id/decks', controller.createDeck);
router.get('/:id/decks/:deckId', controller.showDeck);
router.delete('/:id/decks/:deckId', controller.destroyDeck);

module.exports = router;
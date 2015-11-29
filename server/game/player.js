'use strict';

var Card = new require('./card.js');

function Player(socket, data) {
  this.name = data.name;
  this.wins = data.wins;
  this.games = data.games;
  this.socket = socket;
  this.health = 30;
  this.mp = 1;
  this.hand = [];
  this.fight = [];

  this.cards = [];

  this.processCards(data);
}

Player.prototype.processCards = function(data) {
  var deck = data.deck;

  var id = 0;
  for (var i = 0; i < deck.cards.length; i++) {
    var cardInfo = deck.cards[i];
    for (var j = 0; j < cardInfo.count; j++) {
      this.cards.push(new Card(cardInfo.card, id++));
    }
  }
}

Player.prototype.addCardToHand = function(times) {
  this.fight.push(this.cards[0]);
  this.fight.push(this.cards[1]);

  for (var i = 0; i < times; i++) {
    var rnd = Math.floor(Math.random() * (this.cards.length - 1)) + 1;
    var card = this.cards[rnd];
    this.hand.push(card);
    this.cards.splice(rnd, 1);
    console.log(rnd+ ' - ' + this.cards.length);
  }

}

Player.prototype.getPrivateInfo = function() {
  return {
    name: this.name,
    health: this.health,
    mp: this.mp,
    wins: this.wins,
    games: this.games,
    hand: this.hand,
    fight: this.fight,
    cards: this.cards.length
  };
}

Player.prototype.getPublicInfo = function() {
  return {
    name: this.name,
    health: this.health,
    mp: this.mp,
    wins: this.wins,
    games: this.games,
    fight: this.fight,
    cards: this.cards.length,
    handCount: this.hand.length
  };
}



module.exports = Player;
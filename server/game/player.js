'use strict';

var Card = new require('./card.js');
var User = require('../api/user/user.model').User;

function Player(socket, data) {
  this.turn = false;
  this.name = data.name;
  this.wins = data.wins;
  this.games = data.games;
  this.socket = socket;
  this.health = 30;
  this.mp = 1;
  this.currentMp = 1;
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
      var ncard = new Card(cardInfo.card, id++);
      this.cards.push(ncard);
    }
  }
};

Player.prototype.setTurn = function() {
  if (this.turn) {
    this.turn = false;
  } else {
    this.turn = true;
    for (var i = 0; i < this.fight.length; i++) {
      this.fight[i].available = 1;
      this.fight[i].preTurnPowers();
    }
    if (this.mp < 10)
      this.mp++;
    this.currentMp = this.mp;
    this.addCardToHand(1);
  }
}

Player.prototype.addCardToHand = function(times) {
  for (var i = 0; i < times; i++) {
    var rnd = Math.floor(Math.random() * (this.cards.length - 1)) + 1;
    var card = this.cards[rnd];
    if (this.hand.length < 8) this.hand.push(card);
    this.cards.splice(rnd, 1);
  }
};

Player.prototype.playCard = function(cardId, enemy) {
  if (this.fight.length >= 8) return;
  for (var i = 0; i < this.hand.length; i++) {
    if (this.hand[i].id == cardId && this.hand[i].cost <= this.currentMp ) {
        this.currentMp -= this.hand[i].cost;
        this.hand[i].prePlayPowers(this, enemy)
        this.fight.push(this.hand[i]);
        this.hand.splice(i, 1);
        return;
    }
  }
};

Player.prototype.getFightCard = function(id) {
  for (var i = 0; i < this.fight.length; i++) {
    if (this.fight[i].id == id) return this.fight[i];
  }
};

Player.prototype.attackCard = function(enemy, info) {
  var cardA = this.getFightCard(info.from);
  var cardD = enemy.getFightCard(info.to);

  cardA.attackCard(cardD);
  this.checkDestroy();
  enemy.checkDestroy();
};

Player.prototype.attackHero = function(enemy, info) {
  var cardA = this.getFightCard(info.from);
  console.log(cardA.name + ' attack hero');
  cardA.attackHero(enemy);
};

Player.prototype.checkDestroy = function() {
  for (var i = 0; i < this.fight.length; i++) {
    if (this.fight[i].health <= 0) {
      this.fight.splice(i, 1);
    }
  }
};

Player.prototype.getPrivateInfo = function() {
  return {
    name: this.name,
    health: this.health,
    mp: this.mp,
    cmp: this.currentMp,
    wins: this.wins,
    games: this.games,
    hand: this.hand,
    fight: this.fight,
    cards: this.cards.length
  };


};

Player.prototype.getPublicInfo = function() {
  return {
    name: this.name,
    health: this.health,
    mp: this.mp,
    cmp: this.currentMp,
    wins: this.wins,
    games: this.games,
    fight: this.fight,
    cards: this.cards.length,
    handCount: this.hand.length
  };
};

Player.prototype.gameOver = function(win) {
  User.findOne({ name: this.name }, function(err, user) {
    if (err) return console.log(err);
    user.wins += win;
    user.games += 1;
    user.save(function(err) {
      if (err) return console.log(err);
    });
  });
};


module.exports = Player;
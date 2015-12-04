'use strict';

function Card(card, id) {
  this.name = card.name;
  this.power = card.power;
  this.health = card.health;
  this.attack = card.attack;
  this.cost = card.cost | 0;
  this.img = card.img;
  this.id = id;
  this.available = this.power.indexOf('dash') >= 0? 
    (this.power.indexOf('windfury') >= 0? 2 : 1) : 0;
}

Card.prototype.getInfo = function() {
  return {
    name: this.name,
    power: this.power,
    health: this.health,
    attack: this.attack,
    cost: this.cost,
    img: this.img,
    id: id
  };
}

Card.prototype.attackCard = function(cardD) {
  this.available -= 1;
  if (!this.checkHS()) this.health -= cardD.attack;
  if (!cardD.checkHS()) cardD.health -= this.attack;
}

Card.prototype.attackHero = function(enemy) {
  this.available -= 1;
  enemy.health  -= this.attack;
};

Card.prototype.prePlayPowers = function(player, enemy) {
  if (this.power.indexOf('dest') != -1) {
    enemy.fight= [];
    player.fight = [];
  }

  if (this.power.indexOf('cardBonus') != -1) {
    player.addCardToHand(1);
  }

  if (this.power.indexOf('attackBonus-2') != -1) {
    for (var i = 0; i < player.fight.length; i++) {
      player.fight[i].attack += 2;
    }
  }

  if (this.power.indexOf('healthBonus-2') != -1) {
    for (var i = 0; i < player.fight.length; i++) {
      player.fight[i].health += 2;
    }
  }
};

Card.prototype.preTurnPowers = function(player, enemy) {
  if (this.power.indexOf('windfury') != -1) {
    this.available = 2;
  }
};

Card.prototype.checkHS = function() {
  var i = this.power.indexOf('holy-shield');

  if (i != -1) {
    console.log(i);
    var e = this.power.splice(i, 1);
    console.log(e);
    return true;
  }
};

module.exports = Card;
/*
  name: { 
    type: String, 
    required: true, 
    index: { unique: true }
  },
  power: [String],
  health: Number,
  attack: Number,
  cost: Number,
  img: String
*/
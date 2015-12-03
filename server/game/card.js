'use strict';

function Card(card, id) {
  this.name = card.name;
  this.power = card.power;
  this.health = card.health;
  this.attack = card.attack;
  this.cost = card.cost | 0;
  this.img = card.img | 'cena';
  this.id = id;
  this.available = this.power.indexOf('dash') >= 0? 1 : 0;
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
  this.health -= cardD.attack;
  cardD.health -= this.attack;
}

Card.prototype.attackHero = function(enemy) {
  this.available -= 1;
  enemy.health  -= this.attack;
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
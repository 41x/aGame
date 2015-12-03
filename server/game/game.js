'use strict';



function Game(players, queue) {
  this.players = {};
  this.queue = queue;

  for (var i = 0; i < 2; i++) {
    var name = players[i].name;
    this.players[name] = players[i];
    var k = i == 0? i + 1 : i - 1;
    this.players[name].enemy = players[k].name;
  }

  this.players[players[0].name].turn = true;
    
  for (var i in this.players) {
    this.players[i].addCardToHand(5);
    this.players[i].socket.removeAllListeners('gameConnect');
    this.addOnAll(this.players[i].socket);
  } 
}

Game.prototype.nextTurn = function(name) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];

  if (!player.turn) return;
  
  player.setTurn();
  enemy.setTurn(); 
  this.sendInfoAll(name);
};

Game.prototype.playCard = function(name, cardId) {
  var player = this.players[name];
  if (!player.turn) return;
  player.playCard(cardId);

  this.sendInfoAll(name);
};

Game.prototype.attackCard = function(name, info) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];
  if (!player.turn) return;
  player.attackCard(enemy, info); 

  this.sendInfoAll(name);
};

Game.prototype.attackHero = function(name, info) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];
  if (!player.turn) return;
  player.attackHero(enemy, info); 

  if (enemy.health <= 0) {
    return this.gameOver(player.name, enemy.name);
  }

  this.sendInfoAll(name);
};

Game.prototype.sendInfoAll = function(name) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];

  this.sendInfo(player, enemy);
  this.sendInfo(enemy, player);
};

Game.prototype.sendInfo = function(player, enemy) {
  player.socket.emit('gameInfo', {
    turn: player.turn,
    name: player.name,
    me: player.getPrivateInfo(),
    enemy: enemy.getPublicInfo()
  }); 
};

Game.prototype.enter = function(name) {
  this.sendInfoAll(name);
};

Game.prototype.reconnect = function(name, socket) {
  console.log(name + ' reconnected');
  socket.name = name;
  this.players[name].socket = socket;
  this.addOnAll(socket);
};

Game.prototype.gameOver = function(winnerName, looserName) {
  var winner = this.players[winnerName];
  var looser = this.players[looserName];

  this.RemoveOnAll(winner.socket);
  this.RemoveOnAll(looser.socket);

  this.queue.gameOver(winnerName, looserName);

  winner.socket.emit('gameOver', { message: 'YOU WON!' });
  looser.socket.emit('gameOver', { message: 'YOU LOST!' });

  winner.gameOver(1);
  looser.gameOver(0);
};

/*
  LISTENERS ADD
*/

Game.prototype.addOnAll = function(socket) {
  this.addOnDisconnect(socket);
  this.addOnLeave(socket);
  this.addOnEnter(socket);
  this.addOnTurnEnd(socket);
  this.addOnPlayCard(socket);
  this.addOnAttackCard(socket);
  this.addOnAttackHero(socket);
};

Game.prototype.RemoveOnAll = function(socket) {
  socket.removeAllListeners('gameEnter');
  socket.removeAllListeners('gameLeaver');
  socket.removeAllListeners('disconnect');
  socket.removeAllListeners('gameNextTurn');
};

Game.prototype.addOnPlayCard = function(socket) {
  var game = this;
  socket.on('gamePlayCard', function(data) {
    game.playCard(socket.name, data.cardId);
  });
};

Game.prototype.addOnAttackCard = function(socket) {
  var game = this;
  socket.on('attackCard', function(data) {
    game.attackCard(socket.name, data);
  });
};

Game.prototype.addOnAttackHero = function(socket) {
  var game = this;
  socket.on('attackHero', function(data) {
    game.attackHero(socket.name, data);
  });
};

Game.prototype.addOnEnter = function(socket) {
  var game = this;
  socket.on('gameEnter', function(data) {
    game.enter(socket.name);
  });
};

Game.prototype.addOnLeave = function(socket) {
  var game = this;
  socket.on('gameLeave', function() {
    console.log(socket.name + ' left');
  });
};

Game.prototype.addOnDisconnect = function(socket) {
  var game = this;
  socket.on('disconnect', function() {
    console.log(socket.name + ' disc');
  });
};

Game.prototype.addOnTurnEnd = function(socket) {
  var game = this;
  socket.on('gameNextTurn', function() {
    game.nextTurn(socket.name);
  });
};



module.exports = Game;
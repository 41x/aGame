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
  this.players[players[0].name].ava = 1;
  this.players[players[1].name].ava = 2;

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
  var enemy = this.players[player.enemy];

  if (!player.turn) return;

  player.playCard(cardId, enemy);
  this.sendInfoAll(name);
};

Game.prototype.attackCard = function(name, info) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];

  if (!player.turn) return;

  player.attackCard(enemy, info);
  this.sendInfoAll(name, info);
};

Game.prototype.attackHero = function(name, info) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];

  if (!player.turn) return;
  player.attackHero(enemy, info);

  if (enemy.health <= 0) {
    return this.gameOver(player.name, enemy.name);
  }

  this.sendInfoAll(name, info);
};


Game.prototype.sendInfoAll = function(name, attackInfo) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];

  player.checkTaunt();
  enemy.checkTaunt();

  this.sendInfo(player, enemy, attackInfo);
  this.sendInfo(enemy, player, attackInfo);
};

Game.prototype.sendInfo = function(player, enemy, attackInfo) {
  var info =  {
    turn: player.turn,
    name: player.name,
    me: player.getPrivateInfo(),
    enemy: enemy.getPublicInfo(),
  };

  if (attackInfo) info['attackInfo'] = attackInfo;

  player.socket.emit('gameInfo', info);
};

Game.prototype.enter = function(name) {
  if (this.players[name].time) {
    console.log(name + ' clear timeout');
    clearTimeout(this.players[name].time);
  }
  this.players[name].isLeave = false;
  this.sendInfoAll(name);
};

Game.prototype.reconnect = function(name, socket) {
  console.log(name + ' reconnected');
  socket.name = name;
  this.players[name].socket = socket;
  if (this.players[name].time) {
    console.log(name + ' clear timeout');
    clearTimeout(this.players[name].time);
  }
  this.players[name].isLeave = false;
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

Game.prototype.leave = function(leaverName) {
  var self = this;

  var leaver = this.players[leaverName];
  var notLeaver = this.players[leaver.enemy];
  if (notLeaver.isLeave) return;
  if (leaver.time) clearTimeout(leaver.time);
  leaver.isLeave = true;
  console.log(leaver.name + ' isLeaved and will be loose');
  leaver.time = setTimeout(function() {
    if (leaver.isLeave) {
      var notLeaver = self.players[leaver.enemy];
      if (notLeaver.time) clearTimeout(notLeaver.time);
      self.gameOver( notLeaver.name, leaver.name)
    }
  }, 15 * 1000);
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
  socket.removeAllListeners('gameLeave');
  socket.removeAllListeners('disconnect');
  socket.removeAllListeners('gameNextTurn');
  this.queue.addOnEnter(socket);
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
    console.log(socket.name + ' enter');
  });
};

Game.prototype.addOnLeave = function(socket) {
  var game = this;
  socket.on('gameLeave', function() {
    game.leave(socket.name);
    console.log(socket.name + ' left');
  });
};

Game.prototype.addOnDisconnect = function(socket) {
  var game = this;
  socket.on('disconnect', function() {
    game.leave(socket.name);
    console.log(socket.name + ' left');
  });
};

Game.prototype.addOnTurnEnd = function(socket) {
  var game = this;
  socket.on('gameNextTurn', function() {
    game.nextTurn(socket.name);
  });
};



module.exports = Game;

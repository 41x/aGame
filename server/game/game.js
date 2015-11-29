'use strict';

function Game(players) {
  this.players = {};

  for (var i = 0; i < 2; i++) {
    var name = players[i].name;
    this.players[name] = players[i];
    var k = i == 0? i + 1 : i - 1;
    this.players[name].enemy = players[k].name;
  }
    
  for (var i in this.players) {
    this.players[i].addCardToHand(5);
    this.addOnDisconnect(this.players[i].socket);
    this.addOnLeave(this.players[i].socket);
    this.addOnEnter(this.players[i].socket);
  } 
}

Game.prototype.enter = function(name) {
  var player = this.players[name];
  var enemy = this.players[player.enemy];

  player.socket.emit('gameInfo', {
    me: player.getPrivateInfo(),
    enemy: enemy.getPublicInfo()
  });
};

Game.prototype.addOnEnter = function(socket) {
  var game = this;

  socket.on('gameEnter', function(data) {
    console.log('game:enter');

    game.enter(socket.name);
    console.log(socket.name + ' plays with' );
  });
};

Game.prototype.addOnLeave = function(socket) {
  var game = this;

  socket.on('gameLeave', function() {
    console.log('game:leave');
    console.log(socket.name + ' leaves from ');
  });
};

Game.prototype.addOnDisconnect = function(socket) {
  var game = this;

  socket.on('disconnect', function() {
    console.log('game:enter');
    console.log(socket.name + ' leaves from ');
  });
};


module.exports = Game;
'use strict';

var Player = new require('./player.js');
var Game = require('./game.js');

function Queue() {
  this.players = {};
  this.games = {};
}

Queue.prototype.enter = function(socket, data) {
  this.addOnLeave(socket);
  this.addOnDisconnect(socket);

  var name = socket.name;
  var player = new Player(socket, data);

  this.players[name] = player;
  this.sendCount();
  this.goPlay();
}

Queue.prototype.leave = function(name) {
  delete this.players[name];
  this.sendCount();
}

Queue.prototype.goPlay = function() {
  var keys = Object.keys(this.players);

  if (keys.length >= 2) {
    var who = [];

    for (var i = 0; i < 2; i++) {
      who.push(this.players[keys[i]]);

      this.players[keys[i]].socket.removeAllListeners('disconnect');
      this.players[keys[i]].socket.removeAllListeners('queueEnter');
      this.players[keys[i]].socket.removeAllListeners('queueLeave');

      delete this.players[keys[i]];
    }

    var game = new Game(who, this);
    for (var i = 0; i < 2; i++) {
      this.games[who[i].name] = game;
      who[i].socket.emit('gameStart');
    }
  };
}

Queue.prototype.sendCount = function() {
  for (var i in this.players) {
    this.players[i].socket.emit('queueCount', { count: Object.keys(this.players).length });
  } 
}

Queue.prototype.gameReconnect = function(name, socket) {
  if (this.games[name]) {
    this.games[name].reconnect(name, socket);
    socket.removeAllListeners('queueEnter');
  }
}

Queue.prototype.gameOver = function(winnerName, looserName) {
  delete this.games[winnerName];
  delete this.games[looserName];
};


Queue.prototype.addOnEnter = function(socket) {
  var queue = this;

  socket.on('queueEnter', function(data) {
    socket.name = data.name;
    queue.enter(socket, data);
  });
}

Queue.prototype.addOnLeave = function(socket) {
  var queue = this;

  socket.on('queueLeave', function() {
    queue.leave(socket.name);
  });
}

Queue.prototype.addOnDisconnect = function(socket) {
  var queue = this;

  socket.on('disconnect', function() {
    queue.leave(socket.name);
  });
}

module.exports = Queue;
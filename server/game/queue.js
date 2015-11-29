'use strict';

var Player = new require('./player.js');
var Game = new require('./game.js');

function Queue() {
  this.players = {};
}

Queue.prototype.enter = function(socket, data) {
  var name = socket.name;
  var player = new Player(socket, data);

  this.players[name] = player;
  this.sendCount();
  this.goPlay();
};

Queue.prototype.leave = function(name) {
  delete this.players[name];
  this.sendCount();
};

Queue.prototype.sendCount = function() {
  for (var i in this.players) {
    this.players[i].socket.emit('queueCount', { count: Object.keys(this.players).length });
  } 
};

Queue.prototype.goPlay = function() {
  var keys = Object.keys(this.players);

  if (keys.length >= 2) {
    var who = [];

    for (var i = 0; i < 2; i++) {
      who.push(this.players[keys[i]]);

      this.players[keys[i]].socket.removeAllListeners('disconnect');

      delete this.players[keys[i]];
    }

    var game = new Game(who);
    for (var i = 0; i < 2; i++) {
      who[i].socket.emit('gameStart');
    }
  };
};

Queue.prototype.addOnEnter = function(socket) {
  var queue = this;

  socket.on('queueEnter', function(data) {
    console.log('enter');
    socket.name = data.name;
    queue.enter(socket, data);
    console.log(socket.name + ' : ' + Object.keys(queue.players));
  });
};

Queue.prototype.addOnLeave = function(socket) {
  var queue = this;

  socket.on('queueLeave', function() {
    console.log('leave');
    queue.leave(socket.name);
    console.log(socket.name + ' : ' + Object.keys(queue.players));
  });
};

Queue.prototype.addOnDisconnect = function(socket) {
  var queue = this;

  socket.on('disconnect', function() {
    console.log('disconnected');
    queue.leave(socket.name);
    console.log(socket.name + ' : ' + Object.keys(queue.players));
  });
};

module.exports = Queue;
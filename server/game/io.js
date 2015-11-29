'user strict';

var Game = require('./game.js');
var Queue = require('./queue.js');
var queue = new Queue();

module.exports = function(io) {
  io.on('connection', function(socket){
    queue.addOnEnter(socket);
    queue.addOnLeave(socket);
    queue.addOnDisconnect(socket);
  });   
}
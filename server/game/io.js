'user strict';

var Game = require('./game.js');

var sockets = {};

module.exports = function(io) {
  io.on('connection', function(socket){
    function enterQueue() {
      sockets[socket.name] = socket;
      for (var i in sockets) {
        sockets[i].emit('enemyCount', { count: Object.keys(sockets).length });
      } 


    }

    function leaveQueue() {
      delete sockets[socket.name];
      for (var i in sockets) {
        sockets[i].emit('enemyCount', { count: Object.keys(sockets).length });
      }
    }

    function removeAllListeners() {
      
    }

    socket.on('enter', function(data) {
      console.log('enter');
      socket.name = data.name;
      enterQueue();
      console.log(socket.name + ' ' + Object.keys(sockets));
    });

    socket.on('disconnect', function() {
      console.log('disconnected');
      leaveQueue();
      console.log(socket.name + ' ' + Object.keys(sockets));
    });
    socket.on('leave', function() {
      console.log('leave');
      leaveQueue();
      console.log(socket.name + ' ' + Object.keys(sockets));
    });
  });   
}
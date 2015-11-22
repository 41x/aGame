'use strict';

angular.module('game')
  .factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    console.log("socket created");
 
    return {
      init: function(user) {
        socket.removeAllListeners();
      },

      on: function (eventName, callback) {
          function wrapper() {
              var args = arguments;
              $rootScope.$apply(function () {
                  callback.apply(socket, args);
              });
          }
 
          socket.on(eventName, wrapper);

          return function () {
              socket.removeListener(eventName, wrapper);
          };
        },
 
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if(callback) {
                  callback.apply(socket, args);
              }
            });
          });
        }
    };
  }]);
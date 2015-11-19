'use strict';

angular.module('game', ['ngRoute'])
  .controller('gameController', function($scope, $rootScope, $location, Auth, socket) {
    var vm = this;
    var user = {};
    socket.init();
      Auth.getUser()
        .success(function(data) {
          vm.user = data;

          console.log({ name: data.name});
          socket.emit('enter', { name: data.name });
        });

    vm.isFindGame = false;
    vm.count = 0;
    

    socket.on('findEnemy', function(data) {
        vm.isFindGame = (data.count > 1);
        vm.count = data.count;
        console.log(data.count);
    });

    $scope.$on("$destroy", function() {
        socket.emit('leave');
    });
  })
  .
  factory('socket', ['$rootScope', function ($rootScope) {
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
}]);;
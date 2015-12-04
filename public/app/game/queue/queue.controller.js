'use strict';

angular.module('core', ['ngAnimate'])
  .controller('queueController', function($scope, $rootScope, $location, Auth, socket, player) {
    var vm = this;
    socket.init();

    vm.player = player.getInfo();
    socket.emit('queueConnect');
    socket.emit('queueEnter', vm.player);

    vm.isFindGame = false;
    vm.count = 0;
    
    socket.on('queueCount', function(data) {
        vm.isFindGame = (data.count > 1);
        vm.count = data.count;
    });

    socket.on('gameStart', function(data) {
        $location.path('/game');
    });

    $scope.$on('$destroy', function() {
        socket.emit('queueLeave');
    });
  });
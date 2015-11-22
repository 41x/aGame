'use strict';

angular.module('game', [])
  .controller('queueController', function($scope, $rootScope, $location, Auth, socket, player) {
    var vm = this;
    socket.init();

    vm.player = player.getInfo();

    socket.emit('enter', { name: vm.player.name });

    vm.isFindGame = false;
    vm.count = 0;
    
    socket.on('enemyCount', function(data) {
        vm.isFindGame = (data.count > 1);
        vm.count = data.count;
    });

    $scope.$on('$destroy', function() {
        socket.emit('leave');
    });
  });
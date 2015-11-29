'use strict';

angular.module('core')
  .controller('gameController', function($scope, $rootScope, $location, socket, player) {
    var vm = this;

    socket.init();
    vm.player = player.getInfo();
    vm.enemy = vm.player.enemy;
    vm.me = vm.player.me;

    socket.emit('gameEnter', vm.player);

    socket.on('gameInfo', function(data) {
        player.setInfo(data);
        vm.player = player.getInfo();
        vm.enemy = vm.player.enemy;
        vm.me = vm.player.me;
        console.log(vm.player);
    });
    $scope.$on('$destroy', function() {
        socket.emit('gameLeave');
    });
  });
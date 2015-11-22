'use strict';

angular.module('game', ['ngRoute'])
  .controller('queueController', function($scope, $rootScope, $location, Auth, socket) {
    var vm = this;
    var user = {};
    socket.init();
      Auth.getUser()
        .success(function(data) {
          vm.user = data;

          console.log({ name: data});
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
  });
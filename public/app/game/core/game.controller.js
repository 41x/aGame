'use strict';

angular.module('core')
  .controller('gameController', function($scope, $rootScope, $location, socket, player, Auth) {
    var vm = this;
    var name = player.getInfo().name;
    var toAttack = -1;

    socket.init();

    socket.emit('gameConnect', { name: name });

    vm.canAttackClass = function() {
      if (toAttack != -1) return 'can-attack';
    };

    vm.availableClass = function(card) {
      if (card.id == toAttack) return 'xcard-attack'
      if (card.available > 0) return 'xcard-available';
    };


    vm.attackCard = function(card) {
      console.log(toAttack);
      if (!vm.turn || toAttack == -1) return;

      socket.emit('attackCard', { from: toAttack, to: card.id })
      toAttack = -1;
    }


    vm.attackHero= function() {
      console.log(toAttack);
      if (!vm.turn || toAttack == -1) return;

      socket.emit('attackHero', { from: toAttack })
      toAttack = -1;
    }

    vm.selectToAttack= function(card) {
      if (!vm.turn || card.available <= 0) return;
      if (toAttack == card.id) return toAttack = -1;

      toAttack = card.id;
    };

    vm.attack = function(card) {

    }

    vm.nextTurn = function() {
      if (!vm.turn) return;
      toAttack = -1;
      console.log('next turn');
      socket.emit('gameNextTurn', {});
    };

    vm.playCard = function(id) {
      if (!vm.turn) return;
      toAttack = -1;
      console.log(id);
      socket.emit('gamePlayCard', { cardId: id });
    };

    socket.on('gameInfo', function(data) {
      console.log('game info');
      player.setInfo(data);
      vm.player = player.getInfo();
      vm.enemy = vm.player.enemy;
      vm.me = vm.player.me;
      vm.turn = vm.player.turn;
      console.log(vm.player);
    });

    socket.on('gameOver', function(data) {
      Auth.resetCache();
      player.clear();
      $location.path('/');
    });
    console.log(socket);

    socket.emit('gameEnter', vm.player);

    $scope.$on('$destroy', function() {
      socket.emit('gameLeave');
    });
  });
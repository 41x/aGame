'use strict';

angular.module('main', [])
  .controller('mainController', function($rootScope, $scope, $location, Auth, player) {
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();
    vm.inGame = player.getInGame();

    vm.decks = [];
    vm.hasDecks = false;
    vm.selectedDeck = {};

    Auth.getUser()
        .then(function(success) {
          vm.user = success.data;
          addDecks(success.data.decks);
        }, function(err) {
          $location.path('login');
        });

    vm.play = function() {
      if (vm.selectedDeck != {} && vm.user) {
        player.setInfo({
          name: vm.user.name,
          wins: vm.user.wins,
          games: vm.user.games,
          deck: vm.selectedDeck
        });
        $location.path('/queue');
      }
    }

    $scope.$on('inGameSet', function(event, data) {
      vm.inGame = data.inGame;
    });

    vm.toGame = function() {
      $location.path('/game');
    };

    function addDecks(decks) {
      for (var i in decks) {
        var count = 0;
        for (var j in decks[i].cards) {
          count += decks[i].cards[j].count;
        }

        if (count == 30)
          vm.decks.push(decks[i]);
      }

      if (vm.decks.length > 0) {
        vm.hasDecks = true;
        vm.selectedDeck = vm.decks[0];
      }
    }
  });

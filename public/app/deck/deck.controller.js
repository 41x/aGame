'use strict';

angular.module('deck', [])
  .controller('deckController', function($rootScope, $scope, $location, $http, Auth) {
    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();

    vm.decks = [];
    vm.selectedDeck = null;

    vm.selectDeck = function(deck) {
      vm.selectedDeck = deck;
      console.log(vm.selectedDeck.cards);
    }

    vm.deckClass = function(deck) {
      if (!vm.selectedDeck) return;
      if (vm.selectedDeck._id == deck._id) return 'active';
    }

    vm.isDeckSelected = function() {
      if (!vm.selectedDeck) return false;
      else return true;
    }

    vm.createDeck = function() {
      var deckName = prompt('Enter deck name');
      if (deckName != null) {
        $http.post('/api/decks', { name: deckName })
          .then(function(success) {
            Auth.resetCache();
            Auth.getUser()
                .then(function(success) {
                  vm.user = success.data;
                }, function(err) {
                  $location.path('login');
                });
          }, function(error) {
            console.log(error);
          });
      }
    };

    vm.removeDeck = function() {
      if (!vm.selectedDeck) return;
      $http.delete('/api/decks/' + vm.selectedDeck._id )
        .then(function(success) {
          Auth.resetCache();
          Auth.getUser()
              .then(function(success) {
                vm.user = success.data;
              }, function(err) {
                $location.path('login');
              });
        }, function(error) {
          console.log(error);
        });
    };

    vm.removeCard = function(card) {
      if (!vm.selectedDeck) return;
      $http.delete('/api/decks/' + vm.selectedDeck._id + '/cards/' + card.card._id)
        .then(function(success) {
          if (card.count == 1) {
            var i = vm.selectedDeck.cards.indexOf(card);
            vm.selectedDeck.cards.splice(i, 1);
          } else {
            card.count--;
          }
        }, function(err) {
          console.log(error);
        });
    }

    vm.addCard = function(card) {
      if (!vm.selectedDeck) return;
      $http.post('/api/decks/' + vm.selectedDeck._id + '/cards/' + card._id)
        .then(function(success) {
          for (var i = 0; i < vm.selectedDeck.cards.length; i++) {
            if (vm.selectedDeck.cards[i].card._id == card._id) {
              vm.selectedDeck.cards[i].count++;
              return
            }
          }
          vm.selectedDeck.cards.push({
            card : card,
            count : 1
          });
            //go
        }, function(err) {
          console.log(error);
        });
    };

    $http.get('/api/cards', { cache: true })
        .then(function(success) {
          vm.cards = success.data;
          console.log(vm.cards);
              
    Auth.getUser()
        .then(function(success) {
          vm.user = success.data;
          $('#example').DataTable();
          console.log(vm.user);
        }, function(err) {
          $location.path('/login');
        });
        }, function(err) {
          $location.path('/login');
        });





  });

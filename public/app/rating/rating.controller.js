'use strict';

angular.module('rating', [])
  .controller('ratingController', function($rootScope, $location, $http) {
    var vm = this;
    vm.players = [];

    $http.get('/api/users/rating', { cache: true })
        .then(function(success) {
          vm.players= success.data;
          console.log(vm.rating);
        }, function(err) {
          $location.path('login');
        });
  });

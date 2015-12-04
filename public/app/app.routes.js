'use strict';

angular.module('appRoutes', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'mainController',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'app/account/login/login.html',
        controller: 'accountController',
        controllerAs: 'login'
      })
      .when('/queue', {
        templateUrl: 'app/game/queue/queue.html',
        controller: 'queueController',
        controllerAs: 'queue'        
      })
      .when('/deck', {
        templateUrl: 'app/deck/deck.html',
        controller: 'deckController',
        controllerAs: 'decker'        
      })
      .when('/game', {
        templateUrl: 'app/game/core/game.html',
        controller: 'gameController',
        controllerAs: 'game'        
      })
      ;

    $locationProvider.html5Mode(true);
  });
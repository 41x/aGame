angular.module('appRoutes', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html'
      })
      .when('/login', {
        templateUrl: 'app/account/login/login.html',
        controller: 'mainController',
        controllerAs: 'login'
      })
      .when('/game', {
        templateUrl: 'app/game/game.html',
        controller: 'gameController',
        controllerAs: 'game'        
      })
      ;

    $locationProvider.html5Mode(true);
  });
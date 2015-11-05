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
      });

    $locationProvider.html5Mode(true);
  });
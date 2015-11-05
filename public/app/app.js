angular.module('aGameApp', [
  'ngAnimate',
  'ngCookies',
  'appRoutes',
  'authService',
  'mainCtrl'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

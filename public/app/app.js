var app = angular.module('aGameApp', [
  'ngAnimate',
  'ngCookies',
  'appRoutes',
  'auth',
  'main',
  'game'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

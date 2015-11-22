'use strict';

var app = angular.module('aGameApp', [
  'ngAnimate',
  'ngRoute',
  'ngCookies',
  'appRoutes',
  'auth',
  'account',
  'main',
  'game'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

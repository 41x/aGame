'use strict';

var app = angular.module('aGameApp', [
  'ngAnimate',
  'ngRoute',
  'ngCookies',
  'appRoutes',
  'auth',
  'account',
  'main',
  'core',
  'deck',
  'rating'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

'use strict';

var app = angular.module('aGameApp', [
  'ngAnimate',
  'ngRoute',
  'ngCookies',
  'appRoutes',
  'auth',
  'account',
  'main',
  'core'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

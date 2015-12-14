'use strict';

angular.module('auth', [])
  .factory('Auth', function($http, $cacheFactory, $q, AuthToken, player,$window) {
    var authFactory = {};

    authFactory.login = function(username, password) {
      return $http.post('/auth/local', {
        username: username,
        password: password
      })
        .success(function(data) {
          AuthToken.setToken(data.token);
          return data;
        })
        .error(function(err) {
          return err;
        });
    };

    authFactory.signup = function(username, password) {
      return $http.post('/api/users', {
        name: username,
        password: password
      })
        .success(function(data) {
          return data;
        })
        .error(function(err) {
//          $window.alert('fail')

          return err;
        });

//      return $http.post('/api/users', {
//        name: username,
//        password: password
//      })
//        .success(function(data) {
//          return data;
//        })
//        .error(function(err) {
//          $window.alert('fail')
//
//          return err;
//        });
    };


    authFactory.resetCache = function() {
      $cacheFactory.get('$http').removeAll();
    };

    authFactory.logout = function() {
      AuthToken.setToken();
      player.clear();
      $cacheFactory.get('$http').removeAll();
    };

    authFactory.isLoggedIn = function() {
      if (AuthToken.getToken())
        return true;
      return false;
    };

    
    authFactory.getUser = function() {
      if (AuthToken.getToken())
        return $http.get('/api/users/me', { cache: true });
      else 
        return $q.reject({ message: 'User has no token' });
    };

    return authFactory;
  })
  .factory('AuthToken', function($cookieStore) {
    var authTokenFactory = {};

    authTokenFactory.getToken = function() {
      return $cookieStore.get('token');
    };

    authTokenFactory.setToken = function(token) {
      if (token)
        $cookieStore.put('token', token);
      else
        $cookieStore.remove('token');
    };

    return authTokenFactory;
  })

  .factory('AuthInterceptor', function($q, $location, AuthToken) {
    var interceptorFactory = {};

    interceptorFactory.request = function(config) {
      var token = AuthToken.getToken();

      if (token)
        config.headers.Authorization = 'Bearer ' + token;
      return config;
    };

    interceptorFactory.responseError = function(response) {
      if (response.status == 401) {
        AuthToken.setToken();
        $location.path('/login');
      }

      return $q.reject(response);
    };

    return interceptorFactory;
  });
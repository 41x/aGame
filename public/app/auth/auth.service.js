angular.module('authService', [])
  .factory('Auth', function($http, $q, AuthToken) {
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

    authFactory.logout = function() {
      AuthToken.setToken();
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

  .factory('AuthInterceptor', function($q, AuthToken) {
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
'use strict';

angular.module('account', [])
  .controller('accountController', function($rootScope, $location, Auth,$window) {
    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();
    
    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();

      if (!vm.loggedIn) return;
      Auth.getUser()
        .then(function(success) {
          vm.user = success.data;
        }, function(err) {
          $location.path('login');
        });
    });

    vm.doLogin = function() {
      vm.processing = true;
      vm.error = '';

      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(data) {
          vm.processing = false;
          if (data.success) {
            $location.path('/');
          }
          else
            vm.error = data.message;
        });
    }

    vm.doLogout = function() {
      Auth.logout();

      vm.user = {};
      $location.path('/login');
    }

    vm.doSignup = function() {
      vm.error = '';
      if (vm.loginData.password!==vm.loginData.confirmPassword) {
        vm.error='Пароли не совпадают';
        return;
      }

      Auth.signup(vm.loginData.username, vm.loginData.password)
      .success(function(data) {
          vm.doLogin();
      })
      .error(function(err) {
          vm.error = err.message;
      });
    }
  });
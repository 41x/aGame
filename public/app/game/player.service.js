'use strict';

angular.module('core')
  .service('player', function($rootScope){
    this.info = {};
    this.inGame = false;

    console.log('recreated');

    return {
      setInfo: function(_info) {
        this.info = _info;
        localStorage['player.info'] = JSON.stringify(this.info);
      },

      setInGame: function(_isInGame) {
        this.inGame = _isInGame;
        $rootScope.$broadcast('inGameSet', { inGame: this.inGame });
      },

      getInfo: function() {
        if (this.info) return this.info;
        if (localStorage['player.info'] && localStorage['player.info'].length) {
          this.info = JSON.parse(localStorage['player.info']);
        }

        return this.info;
      },

      getInGame: function() {
        return this.inGame;
      },

      clear: function() {
        this.info = {};
        localStorage['player.info'] = '';
      }
    };
  });

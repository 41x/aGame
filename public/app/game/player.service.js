'use strict';

angular.module('core')
  .service('player', function(){
    this.info = {};

    return {
      setInfo: function(_info) {
        this.info = _info;
        localStorage['player.info'] = JSON.stringify(this.info);
      },
      getInfo: function() {
        if (this.info) return this.info;
        if (localStorage['player.info'] && localStorage['player.info'].length) {
          this.info = JSON.parse(localStorage['player.info']);
        }

        return this.info;
      },
      clear: function() {
        this.info = {};
        localStorage['player.info'] = '';
      }

    };
  });
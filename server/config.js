'use strict';

module.exports = {
  'port': process.env.PORT || 3000,
  'socketPort': 8000,
  'database': 'mongodb://agame:agame@waffle.modulusmongo.net:27017/ynyP6ito',
  'secret': 'secrett',
  'userRoles': ['guest', 'user', 'admin']
};
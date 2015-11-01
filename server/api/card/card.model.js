'use strict';

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CardSchema   = new Schema({
  name: { 
    type: String, 
    required: true, 
    index: { unique: true }
  },
  role: {
    type: String,
    default: 'user'
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  decks:  [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Card' 
  }]
});

UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
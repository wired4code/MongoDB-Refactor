var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

console.log('db: ' + db.userSchema.methods);

db.userSchema.methods = {
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(cb){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
        cb();
      });
  }
};

db.userSchema.pre('save', function(next){
  if(this.isNew){
    this.hashPassword(next);
  }
});

var User = db.model('User', db.userSchema);



module.exports = User;



/*  tableName: 'use',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});*/
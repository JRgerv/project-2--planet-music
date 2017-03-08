'use strict';
var brypt = require('bcrypt');


module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "invalid address."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate{
        len: {
          args:[4, 20],
          msg: "Password must be between 4 and 20 characters."
        }
      }
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    location: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    facebookToken: DataTypes.STRING
  }, {
    hooks:{
      beforeCreate: function(createdUser, options, callback){
        if(createdUser && createdUser.password){
          var hash = bcrypt.hashSync(createdUser.password, 10);
          createdUser.password = hash; //changes users password to hashed password beofre inserting in db
        }
        callback(null, createdUser); //null error message, pass on createdUser
      }
    },
    classMethods: {
      associate: function(models) {
        models.user.belongsToMany(models.tag, {through: models.tagsUsers});
        // associations can be defined here
      }
    },
    instanceMethods: {
      isValidPassword: function(passwordTyped){
        return bcrypt.compareSync(passwordTyped, this.password); //returns boolean
      },
      toJSON: function(){ //makes it so someone can't call the data and get the password
        var data = this.get();
        delete data.password;
        return data;
      }
    }
  });
  return users;
};

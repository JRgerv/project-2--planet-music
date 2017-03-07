'use strict';
module.exports = function(sequelize, DataTypes) {
  var tagsUsers = sequelize.define('tagsUsers', {
    userId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tagsUsers;
};
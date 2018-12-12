'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    token: DataTypes.STRING
  }, {});
  Session.associate = function(models) {
    // associations can be defined here
    Session.belongsTo(models.User);
  };
  return Session;
};
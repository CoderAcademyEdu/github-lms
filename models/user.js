'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'student'
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Session)
  };
  return User;
};
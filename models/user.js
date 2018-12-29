'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'student'
    },
    email: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    login: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Session)
    User.belongsToMany(models.Cohort, {
      through: 'UserCohort',
      as: 'cohorts'
    })
  };
  return User;
};
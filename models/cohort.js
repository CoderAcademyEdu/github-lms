'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cohort = sequelize.define('Cohort', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    }
  }, {});
  Cohort.associate = function(models) {
    // associations can be defined here
    Cohort.belongsToMany(models.User, {
      through: 'UserCohort',
      as: 'users'
    })
    Cohort.findByCode = (code) => {
      return Cohort.findOne({
        where: { code }
      });
    }
  };
  return Cohort;
};
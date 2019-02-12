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
    User.hasMany(models.Attendance)
    User.belongsToMany(models.Cohort, {
      through: 'UserCohort',
      as: 'cohorts'
    })
    User.findByLogin = (login) => {
      return User.findOne({
        where: { login },
        include: {
          model: models.Cohort,
          through: models.UserCohort,
          as: 'cohorts'
        }
      });
    }
    User.findById = (id) => {
      return User.findOne({
        where: { id },
        include: {
          model: models.Cohort,
          through: models.UserCohort,
          as: 'cohorts'
        }
      });
    }
    User.findOrCreateByProfile = (profile) => {
      return User.findOrCreate({
        where: { id: profile.id },
        include: {
          model: models.Cohort,
          through: models.UserCohort,
          as: 'cohorts'
        },
        defaults: {
          id: profile.id,
          role: 'student',
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
          name: profile.name
        }
      });
    }
    User.findAllStudents = () => {
      return User.findAll({
        where: { role: 'student' },
        include: {
          model: models.Cohort,
          through: models.UserCohort,
          as: 'cohorts'
        }
      });
    }
    User.findAllUsers = () => {
      return User.findAll({
        include: {
          model: models.Cohort,
          through: models.UserCohort,
          as: 'cohorts'
        }
      });
    }
  };
  return User;
};
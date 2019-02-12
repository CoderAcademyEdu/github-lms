'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    timeIn: DataTypes.DATE
  }, {});
  Attendance.associate = function(models) {
    Attendance.belongsTo(models.User);
  };
  return Attendance;
};
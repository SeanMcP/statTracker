'use strict'
module.exports = function(sequelize, DataTypes) {
  var Stat = sequelize.define('Stat', {
    activityId: DataTypes.INTEGER,
    measurement: DataTypes.INTEGER
  }, {})

  Stat.associate = function(models) {
    Stat.belongsTo(models.Activity, {
      as: 'stat',
      foreignKey: 'activityId'
    })
  }

  return Stat
}

'use strict'
module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define('Activity', {
    name: DataTypes.STRING,
    unit: DataTypes.STRING
  }, {})

  Activity.associate = function(models) {
    Activity.hasMany(models.Stat, {
      as: 'stats',
      foreignKey: 'activityId'
    })
  }

  return Activity
}

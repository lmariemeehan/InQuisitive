'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
    	type: DataTypes.STRING,
    	allowNull: false,
    	validate: { isEmail: {msg: "must be a valid email"}}
    },
    password: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

  };

    User.prototype.isPremium = function() {
      return this.role === 1;
    };

    User.prototype.isAdmin = function() {
      return this.role === 2;
    };

  return User;
};

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
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    })

  };

    User.prototype.isAdmin = function() {
      return this.role === 2;
    };

    User.prototype.isPremium = function() {
      return this.role === 1;
    };

    User.prototype.isStandard = function() {
      return this.role === 0;
    }

    User.prototype.isCollaborator = function(id) {
      return this.collaborators.find((collaborator) => {
        return collaborator.userId = id;
      });
    };

  return User;
};

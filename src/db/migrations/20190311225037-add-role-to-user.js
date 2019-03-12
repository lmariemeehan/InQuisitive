'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'role', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'Users', 'role');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

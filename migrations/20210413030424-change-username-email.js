'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'username')
    await queryInterface.addColumn('user', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'email')
    await queryInterface.addColumn('user', 'username', {
      type: Sequelize.STRING,
    })
  }
};

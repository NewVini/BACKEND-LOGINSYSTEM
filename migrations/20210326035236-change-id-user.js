'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'id', {
      type: Sequelize.UUID,
      autoIncrement: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true
    })
  }
};

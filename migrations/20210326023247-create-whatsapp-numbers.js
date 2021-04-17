'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WhatsappTokens', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      number: {
        type: Sequelize.STRING,
        unique: true
      },
      wa_token1: {
        type: Sequelize.STRING
      },
      wa_token2: {
        type: Sequelize.STRING
      },
      wa_browser_id: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      enc_key: {
        type: Sequelize.STRING
      },
      mac_key: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WhatsappTokens');
  }
};
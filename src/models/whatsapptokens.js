'use strict';
const {
  Model
} = require('sequelize');

const User = require('./user')
module.exports = (sequelize, DataTypes) => {
  class WhatsappTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WhatsappTokens.belongsTo(models.User)
    }
  };
  WhatsappTokens.init({
    number: { type: DataTypes.STRING, unique: true },
    wa_token1: DataTypes.STRING,
    wa_token2: DataTypes.STRING,
    wa_browser_id: DataTypes.STRING,
    key: DataTypes.STRING,
    enc_key: DataTypes.STRING,
    mac_key: DataTypes.STRING,
    user_id: { type: DataTypes.UUID, references: { model: User, key: 'id' } }
  }, {
    sequelize,
    modelName: 'WhatsappTokens',
    tableName: 'WhatsappTokens',
  });
  return WhatsappTokens;
};
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('XRC20Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tokenOwner: {
        type: Sequelize.STRING
      },
      smartContractAddress: {
        type: Sequelize.STRING
      },
      tokenName: {
        type: Sequelize.STRING
      },
      tokenSymbol: {
        type: Sequelize.STRING
      },
      tokenImage: {
        type: Sequelize.STRING
      },
      tokenInitialSupply: {
        type: Sequelize.INTEGER
      },
      tokenCurrentSupply: {
        type: Sequelize.INTEGER
      },
      mintedTokens: {
        type: Sequelize.INTEGER
      },
      burntTokens: {
        type: Sequelize.INTEGER
      },
      lastMinted: {
        type: Sequelize.DATE
      },
      lastBurnt: {
        type: Sequelize.DATE
      },
      website: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      telegram: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      linkedIn: {
        type: Sequelize.STRING
      },
      reddit: {
        type: Sequelize.STRING
      },
      coinGecko: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('XRC20Tokens');
  }
};
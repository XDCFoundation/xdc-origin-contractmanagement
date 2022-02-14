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
        type: Sequelize.DECIMAL
      },
      tokenCurrentSupply: {
        type: Sequelize.DECIMAL
      },
      mintedTokens: {
        type: Sequelize.DECIMAL
      },
      burntTokens: {
        type: Sequelize.DECIMAL
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
      pausable: {
        type: Sequelize.BOOLEAN
      },
      mintable: {
        type: Sequelize.BOOLEAN
      },
      burnable: {
        type: Sequelize.BOOLEAN
      },
      tokenDecimals: {
        type: Sequelize.INTEGER
      },
      tokenDescription: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      contractAbiString: {
        type: Sequelize.TEXT
      },
      network: {
        type: Sequelize.STRING
      },
      tokenContractCode: {
        type: Sequelize.TEXT
      },
      byteCode: {
        type: Sequelize.TEXT
      },
      isVerified: {
        type: Sequelize.BOOLEAN
      },
      isPaused: {
        type: Sequelize.BOOLEAN
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
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

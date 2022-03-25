'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('XRC721Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tokenType: {
        type: Sequelize.STRING
      },
      tokenOwner: {
        type: Sequelize.STRING
      },
      smartContractAddress: {
        type: Sequelize.STRING
      },
      creationTxHash: {
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
      mintedNFTS: {
        type: Sequelize.INTEGER
      },
      burntNFTS: {
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
      facebook: {
        type: Sequelize.STRING
      },
      tokenDescription: {
        type: Sequelize.TEXT
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
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

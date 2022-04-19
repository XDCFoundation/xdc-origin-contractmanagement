'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('NFTs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      collectionId: {
        type: Sequelize.INTEGER
      },
      nftOwner: {
        type: Sequelize.STRING
      },
      nftTokenId: {
        type: Sequelize.INTEGER
      },
      nftName: {
        type: Sequelize.STRING
      },
      nftDescription: {
        type: Sequelize.TEXT
      },
      ipfsUrl: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      network: {
        type: Sequelize.STRING
      },
      transfers: {
        type: Sequelize.ARRAY(Sequelize.JSON)
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

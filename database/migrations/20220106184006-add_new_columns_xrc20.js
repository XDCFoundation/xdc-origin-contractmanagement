'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
        'XRC20Tokens',
        'tokenDecimals',
        Sequelize.INTEGER,
    ),
      queryInterface.addColumn(
          'XRC20Tokens',
          'tokenDescription',
          Sequelize.STRING,
      ),
      queryInterface.addColumn(
          'XRC20Tokens',
          'burnable',
          Sequelize.BOOLEAN,
      ),
      queryInterface.addColumn(
          'XRC20Tokens',
          'pausable',
          Sequelize.BOOLEAN,
      ),
      queryInterface.addColumn(
          'XRC20Tokens',
          'mintable',
          Sequelize.BOOLEAN,
      )
    ]);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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

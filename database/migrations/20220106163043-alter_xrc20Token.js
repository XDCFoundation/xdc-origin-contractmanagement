'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
        'XRC20Tokens',
        'burnable',
        Sequelize.ARRAY(Sequelize.BOOLEAN),
    ),
      queryInterface.addColumn(
          'XRC20Tokens',
          'pausable',
          Sequelize.ARRAY(Sequelize.BOOLEAN),
      ),
      queryInterface.addColumn(
          'XRC20Tokens',
          'mintable',
          Sequelize.ARRAY(Sequelize.BOOLEAN),
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

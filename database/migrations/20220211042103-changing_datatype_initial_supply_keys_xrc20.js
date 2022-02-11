'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.changeColumn(
        'XRC20Tokens',
        'tokenInitialSupply',
        Sequelize.DECIMAL,
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

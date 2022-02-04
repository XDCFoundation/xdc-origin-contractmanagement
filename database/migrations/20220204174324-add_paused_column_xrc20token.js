'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.addColumn(
        'XRC20Tokens',
        'isPaused',
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

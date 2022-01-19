'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([ queryInterface.changeColumn(
        'XRC20Tokens',
        'contractAbiString',
        Sequelize.STRING(20000),
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

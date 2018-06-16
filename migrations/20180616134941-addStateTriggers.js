'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('stateTriggers', 
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid: {
          type: Sequelize.UUID,
          unique: true,
          defaultValue: Sequelize.UUIDV4
        },
        emailTemplateId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        emailState: {
          type: Sequelize.STRING
        },
        invoiceGenerated: {
          type: Sequelize.BOOLEAN
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('attachments');
  }
};

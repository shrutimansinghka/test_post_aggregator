'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('orders', 
      { 
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid: {
          unique: true,
          defaultValue: Sequelize.UUIDV4  
        },
        orderUUID: {
          type: Sequelize.STRING
        },
        phoneNumber: {
          type: Sequelize.STRING
        },
        toEmail: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false        
        },
        state: {
          type: Sequelize.STRING
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
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('orders');
  }
};

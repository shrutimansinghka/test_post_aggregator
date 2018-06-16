var db = require("../models/index");
var StateMachine = require('javascript-state-machine');
var config = require('../config/index');

const Order = db.sequelize.define("orders", {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uuid: {
    type: db.Sequelize.UUID,
    unique: true,
    defaultValue: db.Sequelize.UUIDV4  
  },
  state: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  orderUUID: {
  	type: db.Sequelize.UUID,
  	allowNull: false
  },
  phoneNumber: {
  	type: db.Sequelize.STRING
  },
  toEmail: {
	type: db.Sequelize.ARRAY(db.Sequelize.STRING),
	allowNull: false
  },
  emailState: {
  	type: db.Sequelize.STRING
  },
  invoiceGenerated: {
  	type: db.Sequelize.BOOLEAN
  },
  emailTemplateId: {
  	type: db.Sequelize.INTEGER
  },
  smsTemplateId: {
  	type: db.Sequelize.INTEGER
  }
});

const Attachment = db.sequelize.define("attachments", {
  id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uuid: {
    type: db.Sequelize.UUID,
    unique: true,
    defaultValue: db.Sequelize.UUIDV4
  },
  key: {
    type: db.Sequelize.STRING
  },
  orderId: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  img: {
    type: db.Sequelize.VIRTUAL
  },
  uploaded: {
    type: db.Sequelize.BOOLEAN
  },
  imgPath: {
    type: db.Sequelize.STRING
  },
  type: {
  	type: db.Sequelize.ENUM("INVOICE")
  }
});

const SMSTemplate = db.sequelize.define("smsTemplates", {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: db.Sequelize.UUID,
        unique: true,
        defaultValue: db.Sequelize.UUIDV4
    },
    name:{
        type: db.Sequelize.STRING,
        unique: true
    },
    body: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
});


const EmailTemplate = db.sequelize.define("emailTemplates", {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: db.Sequelize.UUID,
        unique: true,
        defaultValue: db.Sequelize.UUIDV4
    },
    name: {
        type: db.Sequelize.STRING,
        unique: true    
    },
    body: {
        type: db.Sequelize.STRING,
        allowNull: false
    } 
})


module.exports = {
  Order: Order,
  Attachment: Attachment,
  SMSTemplate: SMSTemplate,
  EmailTemplate: EmailTemplate
 }


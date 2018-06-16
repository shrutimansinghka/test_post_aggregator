var db = require("../models/index");
var Model = require("../models/models");
var emailQueue = require('../../queue/email_queue');
var invoiceQueue = require('../../models/invoice_queue');


const Order = Model.Order;
const Attachment = Model.Attachment;

Order.belongsTo(Model.EmailTemplate, {foreign_key: 'emailTemplateId'});
Order.belongsTo(Model.SMSTemplate, {foreign_key: 'smsTemplateId'});

Order.hasMany(Model.Attachment);

Order.hook('afterCreate', (instance, options) => {
        	var data = instance
	        var job =   invoiceQueue.create('emailQueue', data)
						  .priority('medium')
						  .on('failed', function(err) {
						  	console.log(err)
						  })
						  .attempts(config.imgUploadMaxAttempts).backoff( {delay: config.imgUploadRetryTime, type:'fixed'} )
						  .save(err => 
						  {
						    if(err) {
						      self.res.status(422).json({status: false, message: "Error storing Images"})
						    }
						    if (!err) {
						    	self.res.status(200).json({status: true, message: "Images Added"});
						    }
					    });

})

Order.hook('afterUpdate', (instance, options) => {
  if((order.changed().indexOf('invoiceGenerated') > -1) || 
  	(order.changed().indexOf('emailState') > -1)){
  		StateTrigger.findOne({where: 
  			{emailState: instance.emailState, 
  			invoiceGenerated: instance.invoiceGenerated},
  			include: [
  				{model: EmailTemplate, required: false}
  			]
  		}).then((state) => {
  			switch((state.state)) {
  				case 'initiate_without_invoice': {
  					if(instance.status().can('initiate_without_invoice')) {
  						instance.status().initiate_without_invoice(state.emailTemplate.body)
  					}
  					break;
  				}
  				case 'initiate_with_invoice': {
  					if(instance.status().can('initiate_with_invoice')) {
  						instance.status().initiate_with_invoice(state.emailTemplate.body)
  					}
  					break;
  				}
  			}
  		})
  }
})

Order.update_email_state = function(emailSent, currentState,uuid) {
	Order.findOne({where: {uuid: uuid}}).then((order) => {
		if(emailSent == true) {
			if(order.status().can('email_without_sent')) {
				order.status().email_without_sent()
			} else if(order.status().can('email_with_sent')) {
				order.status().email_with_sent()
			}
		} else {
			if(order.status().can('email_without_failed')) {
				order.status().email_without_failed()
			} else if(order.status().can('email_with_failed')) {
				order.status().email_without_failed()
			}			
		}
	})
}

Order.prototype.status = function(params={}){
  var self = this;
  return new StateMachine({
      init: this.get('state'),
      transitions: [
        { name: 'initiate_without_invoice', from: 'new',    to: 'email_without_initiated' },
        { name: 'initiate_with_invoice', from: 'new', to: 'email_with_initiated'},
        { name: 'initiate_with_invoice', from: 'email_without_sent', to: 'email_with_initiated'}
        { name: 'email_without_sent', from: 'email_without_initiated',    to: 'email_without_sent' },
        { name: 'email_without_failed', from: 'email_without_initiated', to: 'email_without_failed'},
        { name: 'email_without_sent', from: 'email_without_failed', to: 'email_without_sent'},
        { name: 'fail_without_invoice', from: 'email_without_initiated', to: 'email_without_failed' },
        { name: 'email_with_sent', from: 'email_with_initiated', to: 'email_with_sent'},
        { name: 'email_with_failed', from: 'email_with_initiated', to: 'email_with_failed'},
        { name: 'email_with_sent', from: 'email_with_failed', to: 'email_with_sent'},
      ],
      methods: {
        onInitiateWithoutInvoice: function(template) {
        	var data = {}
        	data["body"] = template.replace('__ORDERID__', self.orderId);
        	data["body"] = template.replace('__USERNAME__', self.username);
        	data["orderUUID"] = self.orderUUID
        	data["currentState"] = 'initiate_without_invoice'
            data["to"] = self.to_email
            data["from"] = config.mailSenderEmail
	        var job =   emailQueue.create('emailQueue', data)
						  .priority('medium')
						  .on('failed', function(err) {
						  	console.log(err)
						  })
						  .attempts(config.imgUploadMaxAttempts).backoff( {delay: config.imgUploadRetryTime, type:'fixed'} )
						  .save(err => 
						  {
						    if(err) {
						      self.res.status(422).json({status: false, message: "Error storing Images"})
						    }
						    if (!err) {
						    	self.res.status(200).json({status: true, message: "Images Added"});
						    }
					    });

        },
        onInitiateWithInvoice: function(template) {
        	var data = {}
        	Attachment.getImageObject(self.id).then((image) => {
	        	data["attachment"] = image
	        	data["orderUUID"] = self.orderUUID
	        	data["currentState"] = 'initiate_with_invoice'
	            data["to"] = self.to_email
	            data["from"] = config.mailSenderEmail
	        	data["body"] = template.replace('__ORDERID__', self.orderId);
	        	data["body"] = template.replace('__USERNAME__', self.username);
		        var job =   queue.create('emailQueue', data)
							  .priority('medium')
							  .on('failed', function(err) {
							  	console.log(err)
							  	Attachment.uploadFailedImages(data)
							  })
							  .attempts(config.imgUploadMaxAttempts).backoff( {delay: config.imgUploadRetryTime, type:'fixed'} )
							  .save(err => 
							  {
							    if(err) {
							      console.log(err)
							    }
							    if (!err) {
							    	
							    }
						    });
        	})

        },
        onEmailWithoutSent: function() {

        },
        onFailWithoutInvoice: function() {

        },
        onEmailWithSent: function() {

        },
        onEmailWithFailed: function() {

        },
        onTransition: function(lifecycle){
          if(!self.isNewRecord && lifecycle.from != "none"){
            self.update({state: lifecycle.to});
          }
        }.bind(this),
      }
  })
}


module.exports = Order;

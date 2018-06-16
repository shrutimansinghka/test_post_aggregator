InternalController = require('../internal_controller')
var uuidv4 = require('uuid/v4');

class OrderController extends InternalController {
	constructor(req, res, next){
		super(req, res, next);
		this.validate();
	}

	validate(){
		console.log("check");
	}

	index(next){

	}

	create() {
		var order_params = order_params(self.req.body);
		Order.create(order_params).then((order) => {
			self.res.json({status: true, message: order})
		}).catch((error) => {
			self.res.status(422).json({status: false, message: "Unable to create at the moment"})
		})
	}

	update_invoice_status() {
		if(self.req.body.orderUUID) {
			Order.update({invoiceGenerated: true}, where: {orderUUID: self.req.body.orderUUID}}).
			then((order) => {
				self.res.json({status: true, message: "Successfully Updated"})
			}).catch((error) => {
				self.res.status(422).json({status: false, message: "Unable to update"})
			})
		} else {
			self.res.status(400).json({status: false, message: "Missing params"})
		}
	}


	order_params(params) {
		var keys = [];
		return _.pick(params,keys);	
	}
}

module.exports = OrderController;
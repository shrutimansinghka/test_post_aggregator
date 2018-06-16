ApplicationController = require('../controllers/application_controller')

class InternalController extends ApplicationController {
	constructor(req, res, next){
		super(req, res, next);
		console.log(this);
		//this.validate();
	}

	validate(){
		console.log("Validation Done");
	}

	hello(next){
		this.res.json({message: "It Worked"});
	}

}

module.exports = InternalController;
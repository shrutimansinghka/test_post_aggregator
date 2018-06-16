module.exports = {
	connect : function(req, res, next, name, controller, action){
		var ControllerClass = require("../controllers/"+controller+"_controller");
		var controller = new ControllerClass(req, res);
		controller[action](next);
	}
} 
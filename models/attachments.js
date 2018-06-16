var db = require("../models/index");
var Model = require("../models/models");
var config = require('../config/index')
var fs = require('fs')
var _ = require('lodash');


Attachment.uploadToS3 = function(instance, order) {
	return new Promise(function(resolve, reject) {
		resolve()
	})
}

Attachment.prototype.getUrl = function() {

}

Attachment.getImageObject = function(orderId) {
	return new Promise(function(resolve, reject) {
		resolve('/tmp/image.jpeg')
	})
}

Attachment.uploadFailedImages = function(data) {

}



module.exports = Model.Attachment;
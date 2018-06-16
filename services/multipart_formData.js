var request = require('request');
var Promise = require('bluebird');

var MultiPartRequest = Promise.method(function(url, formData) {
	return new Promise(function(resolve, reject) {
		request.post({url:url, formData: formData}, function multipartRsp(err, httpResponse, body) {
  			if (err) {
    			return reject(err);
  			}
  			return resolve(httpResponse)
		});
	})
})

module.exports = MultiPartRequest
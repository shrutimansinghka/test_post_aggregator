var http = require('https');
var Promise = require('bluebird');

var PromiseRequest = Promise.method(function(options, data={}) {
  return new Promise(function(resolve, reject) { 
    var request = http.request(options, function(response) {
        // Bundle the result
        var result = {
            'httpVersion': response.httpVersion,
            'httpStatusCode': response.statusCode,
            'headers': response.headers,
            'body': '',
            'trailers': response.trailers,
        };

        // Build the body
        response.on('data', function(chunk) {
            result.body += chunk;
        });
        // Resolve the promise

        response.on('end', function(data){
            resolve(result);
        })
        
    });
    
    // Handle errors
    request.on('error', function(error) {
        console.log('Problem with request:', error.message);
        reject(error);
    });
    // console.log(Object.keys(data).length);
    if(Object.keys(data).length > 0){
      request.write(JSON.stringify(data));    
    }
    
    // Must always call .end() even if there is no data being written to the request body
    request.end();
  });
});

module.exports = PromiseRequest;
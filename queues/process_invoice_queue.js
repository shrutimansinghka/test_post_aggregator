
var db = require("../models/index");
const fs = require('fs');
const config = require('../config/index');
var _ = require('lodash');
var S3 = require('../services/s3');



queue.process('invoiceQueue', 10, function(job, done){
  PromiseRequest({
    host: config.email_service.host,
    port: config.email_service.port,
    path: "/internal/invoices",
    method: "POST",
    headers: {'Content-Type' : 'application/json'}
  }, job.data).then((response) => {
      if(response.httpStatusCode == 200){
        // console.log(response.body);
        response = JSON.parse(response.body);

      }
      else{
        done(new Error(JSON.parse(response.body)))
      }
  }).catch((error) => {
  	done(new Error(error))
  })
})
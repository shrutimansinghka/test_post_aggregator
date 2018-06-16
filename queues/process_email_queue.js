
var db = require("../models/index");
const fs = require('fs');
const config = require('../config/index');
var _ = require('lodash');
var S3 = require('../services/s3');
const MultpartFormData = require('../services/multipart_formData');
var Order = require('../models/orders');



queue.process('emailQueue', 10, function(job, done){
  var formData = {}
  if(job.data.attachment) {
    formData["file"] = fs.createReadStream(job.data.attachment)
  }
  formData["data"] = _.pick(job.data, ["toEmail", "body", "fromEmail"])
  var mailUrl = "http://" + config.email_service.host + ":" + config.email_service.port + "/internal/emails" 
  MultiPartRequest(mailUrl, formData).then((response) => {
      if(response.httpStatusCode == 200){
        // console.log(response.body);
        response = JSON.parse(response.body);
        Order.update_email_state(true, job.data["currentState"], job.data["uuid"])
      }
      else{
        Order.update_email_state(false, job.data["currentState"], job.data["uuid"])
        done(new Error(JSON.parse(response.body)))
      }
  }).catch((error) => {
    Order.update_email_state(true, job.data["currentState"], job.data["uuid"])
    done(new Error(error))
  })
})
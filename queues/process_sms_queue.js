
var db = require("../models/index");
const fs = require('fs');
const config = require('../config/index');
var _ = require('lodash');
var S3 = require('../services/s3');



queue.process('smsQueue', 10, function(job, done){

})
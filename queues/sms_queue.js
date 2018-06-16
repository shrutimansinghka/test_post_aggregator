'use strict'
const kue = require('kue');
var config = require("../config/index")



var redisConfig = {prefix: 'q', redis: config.redis};
const SMSQueue = kue.createQueue(redisConfig);

module.exports = smsQueue;









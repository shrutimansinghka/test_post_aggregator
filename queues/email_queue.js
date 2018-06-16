'use strict'
const kue = require('kue');
var config = require("../config/index")



var redisConfig = {prefix: 'q', redis: config.redis};
const emailQueue = kue.createQueue(redisConfig);

module.exports = emailQueue;









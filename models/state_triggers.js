var db = require("../models/index");
var Model = require("../models/models");
var config = require('../config/index')


Model.StateTrigger.belongsTo(Model.EmailTemplate, {foreign_key: 'emailTemplateId'})


module.exports = Model.StateTrigger;
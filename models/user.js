/*jslint node: true */
"use strict";
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  email: String,
  humanApi: {
    humanId: String,
    accessToken: String,
    publicToken: String,
  }
});

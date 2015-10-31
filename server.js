/*jslint node: true */
"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./utils/logger');
var app = express();
var expressListRoutes   = require('express-list-routes');
var Q = require('Q');
var config = require('./config/config');

function databaseConnect() {
  // Database Configuration
  var mongoose = require('mongoose');
  var databaseUrl = config.getConfig().database.url;
  // TODO: username and password to db
  mongoose.connect(databaseUrl);
}

databaseConnect();
app.use(bodyParser.json());

if (config.isDevOrTest()) {
  app.all('/*', function(req, res, next) {
    logger.debug('Request: ' + req.path);
    next();
  });
}

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Add any custom headers for CORS here
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

var api_router = require('./routes');
app.use('/', api_router);
expressListRoutes({ prefix: ''}, 'API:', api_router );

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.path);
  err.status = 404;
  next(err);
});

// log errors
app.use(function(err, req, res, next) {
  logger.error(err.stack);
  next(err);
});

/**
 * Put any app initialization here. Must return a promise
 */
app.locals.startup = function() {
  return Q.fcall(function () {
    return "Initializing server";
  });
};

module.exports = app;

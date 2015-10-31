/**
 * Registers api routes, and any public routes
 * @type {exports}
 */
/*jslint node: true */
"use strict";

var express = require('express');
var humanapiService = require('./humanapiService');

var router = express.Router();

router.post('/findUser', humanapiService.findUser);
router.post('/connect', humanapiService.connect);
router.post('/getData', humanapiService.getData);

router.get('/version', function(req, res) {
  var pjson = require('../package.json');
      res.status(200)
      .json({
        version: pjson.version
      }).end();
});

// router.get('/getdata', isLoggedIn, humanapiService.getData);
module.exports = router;

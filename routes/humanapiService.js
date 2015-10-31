/*jslint node: true */
"use strict";

var request = require('request');
var User = require('../models/user');
var clientSecret = 'dbd691143d88e23f2b1b292570b7496d8f2cccf6';

var HumanApiService = {
  findUser: function(req, res) {
    var email = req.body.email;
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        console.log('Error looking up user');
        console.log(err);
        res.status(404).end();
      } else {
        var returnObj = {};
        if (user && user.humanApi.publicToken) {
          returnObj = {
            email: email,
            publicToken: user.humanApi.publicToken
          }
        }
        res.status(200).json(returnObj).end();
      }
    });
  },

  connect: function(req, res) {
    var sessionTokenObject = req.body;
    console.log('connect: req body');
    console.log(sessionTokenObject);

    sessionTokenObject.clientSecret = clientSecret;

    // send request to Human API
    // Note: this example uses the node.js 'request' library
    request({
      method: 'POST',
      uri: 'https://user.humanapi.co/v1/connect/tokens',
      json: sessionTokenObject
    }, function(err, resp, body) {
      if(err) {
        console.log('Error response from humanapi');
        console.log(err);
        return res.status(422).end();
      }

      //returned payload from Human API
      //store these values with your local user record
      //you will need them to query data and to re-open Human Connect
      var clientUserId = body.clientUserId;

      // humanId: "52867cbede3155565f000a0d",
      // accessToken: "95891f14f4bcpa23261987effc7cfac7fedf7330",
      // publicToken: "2767d6oea95f4c3db8e8f3d0a1238302",
      // clientId: "2e9574ecd415c99346879d07689ec1c732c11036",
      // clientUserId: "user@yourdomain.com"
      User.findOneAndUpdate(
        {email: clientUserId},
        { email: clientUserId,
          humanApi: {
            accessToken: body.accessToken,
            humanId: body.humanId,
            publicToken: body.publicToken
          }
        },
        {upsert: true},
        function(err) {
          if (err) {
            console.log('Error saving response from human api');
            console.log(err);
            res.status(500).end();
          } else {
            res.status(201).send(body);
          }
        }
      );
    });
  },

  getData: function(req, res) {
    var email = req.body.email;
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        console.log('Error looking up user');
        console.log(err);
        res.status(404).end();
      } else {
        var accessToken = user.humanApi.accessToken;
        var headers = {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        };
        var url = 'https://api.humanapi.co/v1/human';
        request({
          method: 'GET',
          uri : url,
          headers : headers
        }, function (error, getDataResponse, body) {
            var parsedResponse;
            if (error) {
              console.log('Unable to connect to the Human API endpoint');
              res.status(500).json({error: 'Unable to connect to the Human API endpoint.'}).end();
            } else {
              if(getDataResponse.statusCode === 401) {
                console.log("Unauthorized request, validate access token");
                res.status(401).json({error: 'Unauthorized'}).end();
              } else {
                try {
                  parsedResponse = JSON.parse(body);
                } catch (error) {
                  console.log('Error parsing JSON response from Human API.');
                  console.log(body);
                  res.status(500).json({error: 'Error parsing JSON response from Human API.'}).end();
                }
                res.status(200).json(parsedResponse).end();
              }
            }
        });
      }
    });
  }
};

module.exports = HumanApiService;

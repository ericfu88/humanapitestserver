/*jslint node: true */
"use strict";

var should = require('should');
var assert = require('assert');
var request = require('supertest');

var tokens = {
  clientId: "839a06d67943bbdcafcd2d0c13625356c135ad05",
  humanId: "cad1434823d2057b7f03b5c1f02da589",
  userId: "5632c551cf6c5e010004e830",
  sessionToken: "0e552a7b07847f5380481df9add58f0c"
};

describe('Test HumanApi Connect', function() {
  var url = 'http://localhost:3001';

  /*
  it('Should be able to successfully connect', function (done) {
    request(url)
      .post('/connect')
      .send(tokens)
      .expect(201)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        done();
      });
  });
  */
});

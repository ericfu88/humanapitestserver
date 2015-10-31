'use strict';

var _ = require('lodash');
var logger = require('../utils/logger');

var Config = {
  _runtimeEnv: function() {
    var env = process.env.NODE_ENV;
    if (env !== 'test' && env !== 'dev' && env !== 'prod') {
      logger.error('Set envrionment variable NODE_ENV to one of test, dev or prod. Current is set to "' + env + '"');
      throw new Error();
    }
    return env;
  },
  getConfig: function() {
    var env = Config._runtimeEnv();
    var base = require('./base');
    var overwrite = require('./' + env);
    return _.merge(base, overwrite);
  },
  isDevOrTest: function() {
    var env = Config._runtimeEnv();
    return env === 'dev' || env === 'test';
  }
};

module.exports = Config;

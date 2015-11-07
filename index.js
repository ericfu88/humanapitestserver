/*jslint node: true */
"use strict";

var app = require('./server');
var logger = require('./utils/logger');
var config = require('./config/config');

// development error handler
// will print stack trace
if (config.isDevOrTest()) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stack traces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

// Start the server
app.set('port', process.env.PORT || config.getConfig().port);

var server = app.listen(app.get('port'), function() {
    app.locals.startup().then(function(){
      logger.info('Fitness server listening on port ' + server.address().port);
    });
});

'use strict';

// =============================================================================
// Module Dependencies ---------------------------------------------------------
// -----------------------------------------------------------------------------
var express = require('express');
var passport = require('passport');



// =============================================================================

// =============================================================================
// App Modules -----------------------------------------------------------------
// -----------------------------------------------------------------------------
var mvc = {};
mvc.config = require('./server/config')(__dirname);
mvc.utils = require('./server/utils');
mvc.controllers = require('./server/controllers');
mvc.routes = require('./server/routes');
// =============================================================================



var app = express();

app.set('port', process.env.PORT || mvc.config.server.port);
app.set('env', process.env.env || mvc.config.server.env);


app.use(express.bodyParser());
app.use(express.json());

app.use(express.urlencoded());
//app.use(expressValidator());
app.use(express.methodOverride());

// =============================================================================

// kill the good for nothing spy
app.disable('x-powered-by');

// =============================================================================
// Session etc -----------------------------------------------------------------
// -----------------------------------------------------------------------------
app.use(express.cookieParser());
app.use(express.cookieSession(mvc.config.secrets.session, {'maxAge': 31104000000}));


app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//==============================================================================
// Initialize the routes in app ------------------------------------------------
// -----------------------------------------------------------------------------
mvc.routes.loadRoutes(app, mvc.utils, mvc.controllers, passport);
// =============================================================================

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});




module.exports = app;
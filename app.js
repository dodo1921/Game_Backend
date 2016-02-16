'use strict';

// =============================================================================
// Module Dependencies ---------------------------------------------------------
// -----------------------------------------------------------------------------
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var passport = require('passport');



// =============================================================================

// =============================================================================
// App Modules -----------------------------------------------------------------
// -----------------------------------------------------------------------------
var mvc = {};
mvc.config = require('./server/config')(__dirname);
mvc.models = require('./server/models');
mvc.utils = require('./server/utils');
mvc.controllers = require('./server/controllers');
mvc.routes = require('./server/routes');
// =============================================================================


var app = express();

app.set('port', process.env.PORT || mvc.config.server.port);
app.set('env', process.env.env || mvc.config.server.env);


//app.use(cookieParser()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 31104000000 }})); // session secret
app.use(passport.initialize());
app.use(passport.session());


app.disable('x-powered-by');


//app.use(app.router);

var router = express.Router();



//==============================================================================
// Initialize the routes in app ------------------------------------------------
// -----------------------------------------------------------------------------
mvc.routes.loadRoutes(router, mvc.utils, mvc.controllers, passport);
// =============================================================================

app.use(router);

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

//var pn = mvc.utils.pubnub;
//pn.initialize();


module.exports = app;
'use strict';

// =============================================================================
// Module Dependencies ---------------------------------------------------------
// -----------------------------------------------------------------------------
var express = require('express');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser   = require('body-parser');
var expsession      = require('express-session');
//var passport = require('passport');



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


app.use(cookieParser()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expsession({ secret: 'keyboard cat', saveUninitialized: true, resave: true, cookie: { maxAge: 31104000000 }})); // session secret

//app.use(cookieSession(mvc.config.secrets.session, {'maxAge': 31104000000}));
app.use(mvc.utils.passport.initialize());
app.use(mvc.utils.passport.session());


app.disable('x-powered-by');


//app.use(app.router);

var router = express.Router();



//==============================================================================
// Initialize the routes in app ------------------------------------------------
// -----------------------------------------------------------------------------
mvc.routes.loadRoutes(router, mvc.utils, mvc.controllers);
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
'use strict';

var mvc = {};
mvc.config = require('../../server/config')(__dirname);
var async = require('async');

var pubnub = require('./pubnub_cititalk');

var postgres = require('./query');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var speakeasy = require('speakeasy');

var secrets = require('../config/secrets');



// =============================================================================
// User Serialiation -----------------------------------------------------------
// -----------------------------------------------------------------------------
passport.serializeUser(function(user, done) {  
  //console.log('serialize:'+user); 
  done(null, user.sCode+':::'+user._id);
});

passport.deserializeUser(function(id_scode, done) {  
      //console.log('deserialize'+id_scode); 

      try{
            var parts = id_scode.split(':::');

            var queryText = 'select * from Users where _id = ($1) AND scode = ($2)';
            var queryText = [ parts[1], parts[0] ];

            postgres.query( queryText, queryText, function(err, rows, result){

                if(err) {
                    //console.log('Error::::OMGOMGOMG');
                    done (err, null);
                  }else if(!result){
                    //console.log('OMGOMGOMG');
                    done( err, null);
                  }else if(rows.length === 0){
                    //console.log('OMGOMGOMG:::Zerolength');
                    done(err, null);                    
                  }else{
                    //console.log('Goooooood:::::OMGOMGOMG::::'+result.length);
                    done(err, rows[0]);
                  }

            });            

      }catch(err){
        done(err, null);
      }

});
// =============================================================================

// =============================================================================
// Signin Required middleware --------------------------------------------------
// -----------------------------------------------------------------------------
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){ 
    //console.log('OMGOMGOMG:::ISAuthenticated');
    return next();

  }else{
        console.log('Auth Error:::'+req.body.chatRoom);
        //res.json({"Error":"Authentication error"});
        res.status(403).send({"Error":"Authentication error"});
    }
};
// =============================================================================




passport.use(new LocalStrategy({
  usernameField: 'userid',
  passwordField: 'verificationCode',
  passReqToCallback: true
},function(req, userid, verificationCode, done) { 

  

})); 

  
    

 

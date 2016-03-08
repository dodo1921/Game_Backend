'use strict';

var mvc = {};
mvc.config = require('../../server/config')(__dirname);
var async = require('async');

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

            var queryText = 'select * from "Users" where id = ($1) AND scode = ($2)';
            var queryValues = [ parts[1], parts[0] ];

            postgres.query( queryText, queryValues, function(err, rows, result){

                if(err) {                    
                    done (err, null);
                  }else if(rows && rows.length === 0){
                    done(new Error('User is not registered.'));                    
                  }else{                    
                    done(err, rows[0]);
                  }

            });            

      }catch(err){
        done(err);
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
        
        res.status(403).json({ success: false, data: 'Auth Error'});
        
    }
};
// =============================================================================




passport.use(new LocalStrategy({
  usernameField: 'userid',
  passwordField: 'verificationCode',
  passReqToCallback: true
},function(req, userid, verificationCode, done) { 

    var referrer = req.body.referrer;

    var queryText = 'select * from "Users" where id = ($1)';
    var queryValues = [ userid ];

    postgres.query( queryText, queryValues, function(err, rows, result){

        if(err) return done(err);

        if(rows && rows.length>0){

            if(rows[0].vcode === verificationCode){

                if(referrer){

                    process.nextTick(function(referrer, userid){

                        queryText = 'select "id" from "Users" where "pno" = ($1)';
                        queryValues = [ referrer ];

                        postgres.query( queryText, queryValues, function(err, rows, result){

                            if( !err && rows && rows.length>0 ){

                                  queryText = 'insert into "Referrals" ("referrerId", "userId") values ( ($1), ($2) ) ';
                                  queryValues = [ rows[0].id, userid ];

                                  postgres.query( queryText, queryValues, function(err, rows, result){

                                  });

                            }

                        }


                    });

                }

              return done(null, row[0]);

            }else{

              return done(new Error('VCODE does not match.'));

            }

        }else{

            return done(new Error('User does not exist.'));
        }        

    }); 


})); 

  
    

 

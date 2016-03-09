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
  console.log('serialize:'+user.scode+':'+user.id+':'+user.pno); 
  done(null, user.scode+':::'+user.id+':::'+user.pno);
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
                    done(true);                    
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

    console.log('Here Inside');

    var referrer = parseInt(req.body.referrer);
    var name  = req.body.name;

    var queryText = 'select * from "Users" where id = ($1)';
    var queryValues = [ userid ];

    postgres.query( queryText, queryValues, function(err, rows, result){

        console.log('Here Inside2');

        if(err) return done(err);

        if(rows && rows.length>0){

            console.log('vode::'+rows[0].vcode+'::::::'+verificationCode);

            if( rows[0].vcode === verificationCode ){

                console.log('Here Inside3');

                if( referrer && !rows[0].isRegis ){

                    process.nextTick(function(referrer, userid){

                        queryText = 'select "id" from "Users" where "pno" = ($1) AND "isRegis" = 1';
                        queryValues = [ referrer ];

                        postgres.query( queryText, queryValues, function(err, rows, result){

                            if( !err && rows && rows.length>0 ){

                                  queryText = 'insert into "Referrals" ("referrerId", "userId") values ( ($1), ($2) ) ';
                                  queryValues = [ rows[0].id, userid ];

                                  postgres.query( queryText, queryValues, function(err, rows, result){

                                  });

                            }

                        });


                    });

                }

                var se = speakeasy.totp({key: 'secret'});
                queryText = 'UPDATE "Users" SET "scode"=($1), "isRegis"=($2), "name"=($3)  WHERE "id"=($4)';
                queryValues = [ se, 1, name ,userid ];

                postgres.query( queryText, queryValues, function(err, rows, result){

                        console.log('Here Inside4');

                        if(err) return done(err); 

                        queryText = 'select * from "Users" where id = ($1)';
                        queryValues = [ userid ];

                        postgres.query( queryText, queryValues, function(err, rows, result){

                              console.log('Here Inside5');

                              if(err) return done(err); 

                              return done(null, rows[0]);

                        });                  
                  
                });

              

            }else{

              console.log('Here Inside6');

              return done({ 'error':'VCODE does not match.' });

            }

        }else{
            console.log('Here Inside7');
            return done({ 'error' : 'User does not exist.' });
        }        

    }); 


})); 

  
    

 

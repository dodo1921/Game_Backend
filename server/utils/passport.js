'use strict';

var mvc = {};
mvc.config = require('../../server/config')(__dirname);
var async = require('async');

var pubnub = require('./pubnub_cititalk');

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
            User.find({'_id':parts[1], 'sCode':parts[0]},{ groupaccesslist:0, invitedlist:0, post_queue:0, grouplist:0, ipaccesslist:0, contactlist:0},function(err, result){
                //console.log('>>>>>>>>>>'+err);
                if(err) {
                    //console.log('Error::::OMGOMGOMG');
                    done (err, null);
                  }else if(!result){
                    //console.log('OMGOMGOMG');
                    done(err, null);
                  }else if(result.length === 0){
                    //console.log('OMGOMGOMG:::Zerolength');
                    done(err, null);                    
                  }else{
                    //console.log('Goooooood:::::OMGOMGOMG::::'+result.length);
                    done(err, result[0]);
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

  
    

 

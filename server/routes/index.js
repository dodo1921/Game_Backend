'use strict';

module.exports = {

  loadRoutes: function(router, utils, controllers, passport) {

    var isAuthenticated = utils.passport.isAuthenticated;
    
    router.get('/', function(req, res) {   

      return res.json({"status":"success"});

    });

    
    router.post('/registerPhone', controllers.registrar.registerPhoneNumber);
    router.post('/verifyCode', controllers.registrar.verifyCode);  
    router.post('/resendVCODE', controllers.registrar.resendVCODE);  
    

    

    
  }

};
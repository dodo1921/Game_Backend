'use strict';

module.exports = {

  loadRoutes: function(app, utils, controllers, passport) {

    var isAuthenticated = utils.passport.isAuthenticated;
    
    app.get('/', function(req, res) {   

      return res.json({"status":"success"});

    });

    
    app.post('/registerPhone', controllers.registrar.registerPhoneNumber);
    app.post('/verifyCode', controllers.registrar.verifyCode);  
    app.post('/resendVCODE', controllers.registrar.resendVCODE); 

    app.post('/getContactByPno', isAuthenticated ,  controllers.contact.getContactByPno); 
    app.post('/getContactById', isAuthenticated, controllers.contact.getContactById); 
    app.get('/getGameState', isAuthenticated, controllers.contact.getGameState); 
    app.post('/getContactsByPhoneNumberList', isAuthenticated, controllers.contact.getContactsByPhoneNumberList); 
    app.post('/getContactsByIDList', isAuthenticated, controllers.contact.getContactsByIDList); 
    app.post('/inviteUser', isAuthenticated, controllers.contact.inviteUser);  
    app.post('/updateGcmToken', isAuthenticated , controllers.contact.updateGcmToken);  


    

    
  }

};
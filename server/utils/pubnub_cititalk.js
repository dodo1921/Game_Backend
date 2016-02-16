var pubnub = require("pubnub").init({    
    publish_key   : 'pub-c-17fb2ba2-2da6-40f7-8f9c-cb73f740645a',
    subscribe_key : 'sub-c-3704c9b4-5311-11e5-85f6-0619f8945a4f',    
    uuid:'CityTalkServer'

});



var PUBNUB = module.exports;

PUBNUB.initialize = function(){
/*
  pubnub.auth('VoxWebServer');

  pubnub.grant({            
    auth_key: 'CitiTalkServer',
    read: true,
    write: true,
    ttl: 0,
    callback: function(m){console.log('OMG'+m)}
  });    

  */ 

};


PUBNUB.getObj = function(){
  
  return pubnub;
}






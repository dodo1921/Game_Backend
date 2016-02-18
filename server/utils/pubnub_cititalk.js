var pubnub = require("pubnub").init({    
    publish_key   : '',
    subscribe_key : '',    
    uuid:''

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






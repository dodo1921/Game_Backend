
var rdbms  = require('../../server/utils/query');
var speakeasy = require('speakeasy');

var passport = require('passport');


var Registrar = module.exports;


Registrar.registerPhoneNumber = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT "id", "isRegis", "createdTime" FROM "Users" where "pno"=($1)';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ success: false, data: err});;

		if(rows && rows.length>0){			

			//create new vcode
			//Update

			var se = speakeasy.totp({key: 'secret'});
			querytext = 'UPDATE "Users" SET vcode=($1) WHERE "id"=($2)';

			values = [se, rows[0].id];

			rdbms.query(querytext, values, function(err, rows, result){

				if(err) res.status(500).json({ success: false, data: err});

				//send sms

				return res.json({'status': 'success' });


			});


			

		}else if(rows && rows.length == 0){

			//create new vcode
			//insert

				var se = speakeasy.totp({key: 'secret'});
				querytext = 'INSERT INTO "Users"( "pno", "vcode" ) VALUES ( ($1), ($2))';

				values = [pno, se];

				rdbms.query(querytext, values, function(err, rows, result){

					if(err) res.status(500).json({ success: false, data: err});

					//send sms

					return res.json({'status': 'success' });

					
				});

		}			
	

	});	

};


Registrar.verifyCode = function(req, res) {


	passport.authenticate('local', function(err, user, info) {
        if (err) return res.status(500).json({ success: false, data: err});
        
        req.logIn(user, function(err) {      
            if (err) return res.status(500).json({ success: false, data: err});
            //console.log(user);
            return res.json({'user': user}); 
        });
		    
    })(req, res, next);


}



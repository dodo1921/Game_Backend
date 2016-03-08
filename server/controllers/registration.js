
var rdbms  = require('../../server/utils/query');
var speakeasy = require('speakeasy');


var Registrar = module.exports;


Registrar.registerPhoneNumber = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT "id", "isRegis", "createdTime" FROM "Users" where "pno"=($1)';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.json({'error':'Database Error'});

		if(rows && rows.length>0){			

			//create new vcode
			//Update

			var se = speakeasy.totp({key: 'secret'});
			querytext = 'UPDATE "Users" SET vcode=($1) WHERE "id"=($2)';

			values = [se, rows[0].id];

			rdbms.query(querytext, values, function(err, rows, result){

				if(err) res.json({'error':'Database Error'});

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

					if(err) res.json({'error':'Database Error'});

					//send sms

					return res.json({'status': 'success' });

					
				});

		}	

		
	

});
	

	

};



'use strict';

var rdbms  = require('../../server/utils/query');
var speakeasy = require('speakeasy');

var passport = require('passport');


var Registrar = module.exports;


Registrar.registerPhoneNumber = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT "id", "isRegis", "createdTime" FROM "Users" where "pno"=($1)';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success' : false, data: err});

		if(rows && rows.length>0){			

			//create new vcode
			//Update

			var idd = rows[0].id;

			var se = speakeasy.totp({secret: 'secret'});
			querytext = 'UPDATE "Users" SET "vcode"=($1) WHERE "id"=($2)';

			values = [ se, rows[0].id ];

			rdbms.query(querytext, values, function(err, rows, result){

				if(err) res.status(500).json({ 'success' : false, data: err});

				if(result && result.rowCount == 0 ) res.status(500).json({ 'success' : false, data: 'User does not exist.' });

				//send sms

				return res.json({ 'success' : true , 'id': idd });


			});


			

		}else if(rows && rows.length == 0){

			//create new vcode
			//insert

				var se = speakeasy.totp({ secret: 'secret'});
				querytext = 'INSERT INTO "Users"( "pno", "vcode" ) VALUES ( ($1), ($2) )';

				values = [ pno, se ];

				rdbms.query(querytext, values, function(err, rows, result){

					if(err) res.status(500).json({ 'success' : false, data: err});

					if(result && result.rowCount==0 ) res.status(500).json({ 'success' : false, data: 'User does not exist.' });

					//send sms

					querytext = 'SELECT "id" FROM "Users" where "pno"=($1)';

					values = [ pno ];

					rdbms.query(querytext, values, function(err, rows, result){

						if(err) res.status(500).json({ 'success' : false, data: err});

						if(rows && rows.length == 0) res.status(500).json({ 'success' : false, data:'User does not exist.' });


						return res.json({ 'success' : true,  'id': rows[0].id });

					});

					

					
				});

		}			
	

	});	

};


Registrar.verifyCode = function(req, res, next) {



	passport.authenticate('local', function(err, user, info) {
        if (err) res.status(500).json({ 'success' : false, data: err});
        
        req.logIn(user, function(err) {      
            if (err) res.status(500).json({ 'success' : false, data: err});

            var curr_time = new Date().getTime();
            //console.log(user);
            return res.json({ 'success' : true, 'request': 'verifyCode', 'user': user, 'time': curr_time }); 
        });
		    
    })(req, res, next);;


};


Registrar.resendVCODE = function(req, res) {


	var userid = parseInt(req.body.userId);

	var se = speakeasy.totp({ secret: 'secret'});
	var querytext = 'UPDATE "Users" SET "vcode"=($1) WHERE "id"=($2)';

	var values = [se, userid];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success' : false, data: err});

		if(result && result.rowCount==0 ) res.status(500).json({ 'success' : false, data: 'User does not exist.' });

		//send sms

		return res.json({'success': true, 'request': 'resendVCODE' });


	});


};



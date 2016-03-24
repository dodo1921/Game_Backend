var rdbms  = require('../../server/utils/query');


var Contact = module.exports;


Contact.getContactByPno = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT * FROM "Users" where "pno"=($1) AND "isRegis" = TRUE';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( rows && rows.length == 0){

			res.status(500).json({ 'success' : false, data: 'User does not exist' });


		}else if(rows && rows.length>0){

			return res.json({ 'success': true, 'user': rows[0] })

		}	

	});

};


Contact.getContactById = function(req, res) {

	var idd = parseInt(req.body.idd);

	var querytext = 'SELECT * FROM "Users" where "id"=($1) AND "isRegis" = TRUE';

	var values = [idd];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( rows && rows.length == 0){

			res.status(500).json({ 'success' : false, data: 'User does not exist' });


		}else if(rows && rows.length>0){

			return res.json({ 'success': true, 'user': rows[0] })

		}		



	});


};



Contact.getGameState = function(req, res) {

	

	//var querytext = 'SELECT "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h"  FROM "Users" where "id"=($1)';

	return res.json({ 'success': true, 'user': req.user });


};


Contact.getContactsByPhoneNumberList = function(req, res) {

	var phoneNumberList = req.body.phoneNumberList;

	var params = [];
	for(var i = 1; i <= phoneNumberList.length; i++) {
	  params.push('$' + i);
	}

	var querytext = 'SELECT "id", "pno", "name", "gcmtoken", "image_current", "image_seq","status_msg" FROM "Users" where "pno" IN ('+ params.join(',') + ') AND "isRegis" = TRUE';	

	rdbms.query(querytext, phoneNumberList, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if(rows){

			return res.json({ 'success': true, 'user': rows })

		}else{
			
			res.status(500).json({ 'success': false });
		}

	});

};


Contact.getContactsByIDList = function(req, res) {

	var idList = req.body.idList;

	var params = [];
	for(var i = 1; i <= idList.length; i++) {
	  params.push('$' + i);
	}

	var querytext = 'SELECT "id", "pno", "name", "gcmtoken", "image_current", "image_seq","status_msg" FROM "Users" where "id" IN ('+ params.join(',') + ') ';	

	rdbms.query(querytext, idList, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if(rows){

			return res.json({ 'success': true, 'user': rows })

		}else{
			
			res.status(500).json({ 'success': false });
		}

	});

};



Contact.inviteUser = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT * FROM "Users" where "pno"=($1) AND "isRegis" = TRUE';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( rows && rows.length == 0){

			//send sms for invite

			querytext = 'UPDATE "Users" SET "inviteCount"= "inviteCount" + 1 WHERE "id"=($1)';

			values = [req.user.id];

			rdbms.query(querytext, values, function(err, rows, result){});

			return res.json({ 'success': true });
			

		}else if(rows && rows.length>0){

			return res.json({ 'success': true, 'user': rows[0] })

		}		



	});

};



Contact.updateGcmToken = function(req, res) {

	var token = req.body.gcm_token;

	var querytext = 'UPDATE "Users" SET "gcmtoken"= ($1) WHERE "id"=($2)';

	var values = [token, req.user.id];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success' : false, data: err});

		if(result && result.rowCount == 0 ) res.status(500).json({ 'success' : false, data: 'Token not updated' });

		//send sms

		return res.json({ 'success' : true });

	});


}







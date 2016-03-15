var rdbms  = require('../../server/utils/query');


var Contact = module.exports;


Contact.getContactByPno = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT * FROM "Users" where "pno"=($1) AND "isRegis" = 1';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( (rows && rows.length == 0) || !rows){

			return res.status(500).json({ 'success' : false, data: { 'error': 'User does not exist' } });


		}else if(rows && rows.length>0){

			return res.json({ 'success': true, 'user': rows[0] })

		}		



	});



};


Contact.getContactById = function(req, res) {

	var idd = parseInt(req.body.idd);

	var querytext = 'SELECT * FROM "Users" where "id"=($1) AND "isRegis" = 1';

	var values = [idd];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( (rows && rows.length == 0) || !rows){

			return res.status(500).json({ 'success' : false, data: { 'error': 'User does not exist' } });


		}else if(rows && rows.length>0){

			return res.json({ 'success': true, 'user': rows[0] })

		}		



	});


};



Contact.inviteUser = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT * FROM "Users" where "pno"=($1) AND "isRegis" = 1';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( (rows && rows.length == 0) || !rows){

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







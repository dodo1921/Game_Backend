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



}


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


}



Contact.inviteUser = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT * FROM "Users" where "pno"=($1) AND "isRegis" = 1';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if( (rows && rows.length == 0) || !rows){

			//send sms for invite

			return res.json({ 'success': true })


		}else if(rows && rows.length>0){

			return res.json({ 'success': true, 'user': rows[0] })

		}		



	});




}
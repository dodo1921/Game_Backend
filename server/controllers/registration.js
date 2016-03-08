
var rdbms  = require('../../server/utils/query');


var Registrar = module.exports;


Registrar.registerPhoneNumber = function(req, res) {

	var pno = parseInt(req.body.pno);

	var querytext = 'SELECT "id", "isRegis", "createdTime" FROM "Users" where "pno"=$1';

	var values = [pno];

	rdbms.query(querytext, values, function(err, rows, result){

		if(err) console.log( 'Error::' + err);

		console.log( 'RESULT:::' + result );	

		return res.json({'success': rows});

	})
	

	

};



'use strict';

var pg = require('pg');

var connectionstring = process.env.postgresurl;

module.exports = {

	query : function( queryText, queryValues, cb ){

		pg.connect(function(err, client, release) {
	     //connection failure
	     //we don't need to release anything
	     //because we were never handed a client in this case
	     if(err) return cb(err);

	     client.query(queryText, queryValues, function(err, result) {
	       //always release the client
	       release();

	       if(err) return cb(err);

	       //i like to return the rows directly since 99% of the time
	       //I don't care about the other properties on the result object
	       return cb(null, result.rows, result);
	     });
	   });

	}




} 
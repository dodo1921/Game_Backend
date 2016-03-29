'use strict';

var pg = require('pg');

var connectionstring = process.env.DATABASE_URL;

module.exports = {

	query : function( queryText, queryValues, cb ){

		pg.connect( connectionstring, function(err, client, release) {
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

	},

	putJewelInShop: function( sellerId, jewelType, price, qty, cb ){


			pg.connect( connectionstring, function(err, client, release) {
		    if(err) return cb(err);

		    var curryError = function(dispose, next) {
		      return function(err, res) {
		        if(err) {
		          //if we pass 'truthy' to release it will
		          //close & throw away the client & replace it with a new one
		          //in the pool - i do this for 'critical' query errors
		          release(dispose);
		          return cb(err);
		        }
		        return next(res.rows, res);
		      }
		    }

		    client.query('BEGIN', curryError(true, function() {

		      var queryText = 'update "Users" set "'+jewelType+'" = Coalesce("'+jewelType+'", 0) - ($1) where "id" = ($2)';
		      client.query(queryText, [ qty, sellerId ], curryError(true, function(rows1, result1) {		        

		        var market_transaction = 'INSERT INTO "Market" ("sellerId", "type", "qty", "price", "is_sold") values ( ($1), ($2), ($3), ($4), ($5)) returning Tid';

		        //debit & credit accounts
		        client.query(market_transaction, [sellerId, jewelType, qty, price, false ], curryError(true, function(rows2, result2) {		         

		            //finally commit our transaction
		            client.query('COMMIT', curryError(true, function() {

		              cb(null, rows2, result2);

		            }));

		        }));

		      }));

		    }));//BEGIN

		  }); 


	},

	buyJewelFromShop:  function( sellerId, buyerId, totalcoins, cb ){


		pg.connect( connectionstring, function(err, client, release) {
	    if(err) return cb(err);

		    var curryError = function(dispose, next) {
			      return function(err, res) {
				        if(err) {
				          //if we pass 'truthy' to release it will
				          //close & throw away the client & replace it with a new one
				          //in the pool - i do this for 'critical' query errors
				          release(dispose);
				          return cb(err);
				        }
				        return next(res.rows, res);
			      }
		    }

		    client.query('BEGIN', curryError(true, function() {

		      var queryText1 = 'update "Market" set "bId" = ($1), "date_sold" = ($4), "is_sold" = ($3) where "Tid" = ($2) ';

		      client.query(queryText, [ buyerId, Tid, true, new Date() ], curryError(true, function(rows1, result1) {		        

			        var queryText2 = 'update "Users" set "Y" = "Y" + ($2) where "id" = ($1)';

			        //debit & credit accounts
			        client.query(queryText2, [sellerId, totalcoins ], curryError(true, function(rows2, result2) {	

			        	var queryText3 = 'update "Users" set "Y" = "Y" - ($2) where "id" = ($1)';

			        	client.query(queryText3, [ buyerId, totalcoins ], curryError(true, function(rows3, result3) {		         

					            //finally commit our transaction
					            client.query('COMMIT', curryError(true, function() {

					              cb(null);

					            }));

					    }));        

			        }));

		      	}));

		    }));//BEGIN

		}); 


	}


} 




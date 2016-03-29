'use strict';

var rdbms  = require('../../server/utils/query');


var Market = module.exports;


Market.putJewelInShop = function(req, res){

	var type = req.body.type;
	var qty = parseInt(req.body.qty);

	if( type === 'A' ){

		if(req.user.A<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'B' ){

		if(req.user.B<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'C' ){

		if(req.user.C<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'D' ){

		if(req.user.D<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'E' ){

		if(req.user.E<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'F' ){

		if(req.user.F<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'G' ){

		if(req.user.G<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'H' ){

		if(req.user.H<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'I' ){

		if(req.user.I<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'J' ){

		if(req.user.J<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'K' ){

		if(req.user.K<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'L' ){
		if(req.user.L<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'M' ){

		if(req.user.M<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'N' ){

		if(req.user.N<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'O' ){

		if(req.user.O<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'P' ){

		if(req.user.P<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'Q' ){

		if(req.user.Q<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'R' ){

		if(req.user.R<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'S' ){

		if(req.user.S<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'T' ){

		if(req.user.T<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'U' ){

		if(req.user.U<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'V' ){

		if(req.user.V<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'W' ){

		if(req.user.W<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'X' ){

		if(req.user.X<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'a' ){

		if(req.user.a<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'b' ){

		if(req.user.b<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'c' ){

		if(req.user.c<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'd' ){

		if(req.user.d<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'e' ){

		if(req.user.e<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'f' ){

		if(req.user.f<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'g' ){

		if(req.user.g<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}else if( type === 'h' ){

		if(req.user.h<qty)
			res.status(500).json({'success': false, 'data': 'Illegal Operation'});

	}

	var price = req.body.price;

	rdbms.putJewelInShop(req.body.sellerId, type, price, qty, function(err, rows, result){

		if(err) res.status(500).json({'success': false, 'data': err });

		return res.json({'success': true, 'marketid': rows[0].Tid });

	});



};


Market.buyJewelFromShop = function(req, res){

	var totalJewelCount = req.user.A+req.user.B+req.user.C+req.user.D+req.user.E+req.user.F+req.user.G+
	req.user.H+req.user.I+req.user.J+req.user.K+req.user.L+req.user.M+req.user.N+req.user.O+req.user.P+
	req.user.Q+req.user.R+req.user.S+req.user.T+req.user.U+req.user.V+req.user.W+req.user.X+req.user.a+
	req.user.b+req.user.c+req.user.d+req.user.e+req.user.f+req.user.g+req.user.h;



    var queryText = 'select * from "Market" where "Tid" = ($1)';

    var queryValues = [req.body.Mid];

	rdbms.query( queryText, queryValues, function(err, rows, result){

		if(err) res.status(500).json({ 'success' : false, data: err});

		if(rows[0].qty + totalJewelCount > req.user.store_max)
			return res.json({ 'success': false, 'data': 'Not enough space in jewel store' });

		if(req.user.Y < (rows[0].qty * rows[0].price))
			return res.json({ 'success': false, 'data': 'Not enough coins for the transaction' });

		rdbms.buyJewelFromShop(rows[0].sellerId, req.user.id, (rows[0].qty * rows[0].price), function(err, rows, result){

			if(err) res.status(500).json({'success': false, 'data': err });

			return res.json({'success': true});

		});


	});	



};


Market.getMarketItemsPageWise = function(req, res){

	var page =  parseInt(req.body.page);

	var queryText = 'select "Market"."sellerId", "Market"."type", "Market"."qty", "Market".price, "Users"."image_current" from "Market" JOIN "Users" ON "Market"."sId" = "Users"."id" where "Market"."is_sold" = FALSE order by "Market"."Tid" DESC LIMIT 50 OFFSET ($1)';

    var queryValues = [(50*page)]; 

    rdbms.query( queryText, queryValues, function(err, rows, result){

    	if(err) res.status(500).json({ 'success' : false, data: err});

    	return res.json({ 'success':true, 'ItemList': rows});

    });

};


Market.getUsersShopListing = function(req, res){

	var userId = req.body.userId;

	var queryText = 'select * from "Market" where "sId" = ($1) AND "is_sold" = FALSE';

    var queryValues = [userId]; 

    rdbms.query( queryText, queryValues, function(err, rows, result){

    	if(err) res.status(500).json({ 'success' : false, data: err });

    	return res.json({ 'success':true, 'ItemList': rows });

    });

};



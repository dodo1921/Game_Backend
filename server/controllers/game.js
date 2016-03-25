'use strict';

var rdbms  = require('../../server/utils/query');





var Game = module.exports;



Game.pickBasicJewel = function(req, res){

	var type = req.body.type;

	if(!(type === 'A' || type === 'B' || type === 'C' || type === 'D'))
		res.status(500).json({ 'success': false, data: 'Illegal Operation'});

	var totalJewelCount = req.user.A+req.user.B+req.user.C+req.user.D+req.user.E+req.user.F+req.user.G+
	req.user.H+req.user.I+req.user.J+req.user.K+req.user.L+req.user.M+req.user.N+req.user.O+req.user.P+
	req.user.Q+req.user.R+req.user.S+req.user.T+req.user.U+req.user.V+req.user.W+req.user.X+req.user.a+
	req.user.b+req.user.c+req.user.d+req.user.e+req.user.f+req.user.g+req.user.h;
	

	if(totalJewelCount >= req.user.store_max)
		return res.json({'success': false, 'message': 'Jewel Store is full.'});

	var xp, level, xp_max, levelchange; 
	if( req.user.xp + 2 > req.user.xp_max ){
		levelchange = true;
		level = req.user.level+1;
		xp_max = Math.ceil(196 + (24 * level) + (100 * Math.sin(level)));
		xp = (req.user.xp_max - req.user.xp)+2;
	}else{
		levelchange = false;
		xp = req.user.xp+2;
		level = req.user.level;
		xp_max = req.user.xp_max;
	}


	
	var	queryText = 'update "Users" SET "'+type+'" = Coalesce("'+type+'", 0) + 1, "level" = ($1), "xp" = ($2), "xp_max" = ($3)   where "id"=($4)';

	var queryValues = [level, xp, xp_max, req.user.id];		

	rdbms.query( queryText, queryValues, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		queryText = 'select * from "Users" where "id" = ($1)';

		queryValues = [req.user.id];

		rdbms.query( queryText, queryValues, function(err, rows, result){

			if(err) res.status(500).json({ 'success': false, data: err});

			process.nextTick(function(){

				var jewelsenderId = req.body.senderId;

				queryText = 'update "BasicJewelPickLog" set "count" = "count" + 1 where "pickerId" = ($1) AND "senderId" = ($2) AND "jewelType" = ($3)';

				queryValues = [req.user.id, jewelsenderId, type ];

				rdbms.query( queryText, queryValues, function(err, rows, result){

					if(!err && result && result.rowCount == 0){

						queryText =  'insert into "BasicJewelPickLog" ("senderId","pickerId","jewelType","count") values( ($1),($2),($3),($4)) ';

						queryValues = [ jewelsenderId, req.user.id, type, 1 ];


						rdbms.query( queryText, queryValues, function(err, rows, result){


						});

					}

				});


			});


			return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
				'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
				 'levelchange': levelchange });


		});



	});


};


Game.placeJewel = function(req, res){

	var type = req.body.type;
	var position = parseInt(req.body.position);

	var luckynumber = parseInt(req.body.luckynumber);

	var gameboardstate = req.user.board_state;

	newstate = gameboardstate.substr(0, position) + '1' + gameboardstate.substr(position+1);


	var xp, level, xp_max, levelchange; 
	if( req.user.xp + 2 > req.user.xp_max ){
		levelchange = true;
		level = req.user.level+1;
		xp_max = Math.ceil(196 + (24 * level) + (100 * Math.sin(level)));
		xp = (req.user.xp_max - req.user.xp)+2;
	}else{
		levelchange = false;
		xp = req.user.xp+2;
		level = req.user.level;
		xp_max = req.user.xp_max;
	}



	var	queryText = 'update "Users" SET "'+type+'" = Coalesce("'+type+'", 0) - 1, "board_state" = ($1), "level" = ($2), "xp" = ($3), "xp_max" = ($4)  where "id"=($5) AND COALESCE("'+type+'", 0)>0';

	var queryValues = [newstate, level, xp, xp_max, req.user.id];


	rdbms.query( queryText, queryValues, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if(result && result.rowCount == 0){

			return res.json({ 'A': req.user.A, 'B': req.user.B, 'C': req.user.C, 'D': req.user.D, 
				'Y': req.user.Y, 'Z': req.user.Z, 'LEVEL': req.user.level , 'XP_MAX': req.user.xp_max, 'XP': req.user.xp,
				 'levelchange': false });

		}

		queryText = 'select * from "Users" where "id" = ($1)';

		queryValues = [req.user.id];

		rdbms.query( queryText, queryValues, function(err, rows, result){

			if(err) res.status(500).json({ 'success': false, data: err});

			return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
				'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
				 'levelchange': levelchange });


		});

	});


};


Game.gameBoardUpdate = function(req, res){


};






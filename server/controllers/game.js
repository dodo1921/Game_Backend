'use strict';

var rdbms  = require('../../server/utils/query');

var bonus  = require('../../server/utils/bonus');


var board  = require('../../server/utils/levels');


var luckycounter = 0;




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
		xp = (req.user.xp - req.user.xp_max)+2;
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

	var gameboard = req.user.board;

	var jewelAt = gameboard.charAt(position);

	if( jewelAt !== type )
		 res.status(500).json({ 'success': false, data: 'Illegal Operation'} );

	if(gameboardstate.charAt(position) === '1')	
		return res.json({ 'A': req.user.A, 'B': req.user.B, 'C': req.user.C, 'D': req.user.D, 
					'Y': req.user.Y, 'Z': req.user.Z, 'LEVEL': req.user.level , 'XP_MAX': req.user.xp_max, 'XP': req.user.xp,
					 'levelchange': false, 'gift': 'none', 'board': req.user.board, 'board_state': req.user.board_state });


	var newstate = gameboardstate.substr(0, position) + '1' + gameboardstate.substr(position+1);


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

	var queryText, queryValues, gift;

	if(luckynumber==6){

		luckycounter = (luckycounter+1)%1024;

		gift = bonus[luckycounter];

		if(gift === 'Y')
			queryText = 'update "Users" SET "'+type+'" = Coalesce("'+type+'", 0) - 1, "'+gift+'" = Coalesce("'+gift+'", 0) + 10 , "board_state" = ($1), "level" = ($2), "xp" = ($3), "xp_max" = ($4)  where "id"=($5) AND COALESCE("'+type+'", 0)>0';
		else
			queryText = 'update "Users" SET "'+type+'" = Coalesce("'+type+'", 0) - 1, "'+gift+'" = Coalesce("'+gift+'", 0) + 1 , "board_state" = ($1), "level" = ($2), "xp" = ($3), "xp_max" = ($4)  where "id"=($5) AND COALESCE("'+type+'", 0)>0';


		queryValues = [newstate, level, xp, xp_max, req.user.id];

	}else{

		queryText = 'update "Users" SET "'+type+'" = Coalesce("'+type+'", 0) - 1, "board_state" = ($1), "level" = ($2), "xp" = ($3), "xp_max" = ($4)  where "id"=($5) AND COALESCE("'+type+'", 0)>0';

		queryValues = [newstate, level, xp, xp_max, req.user.id];

	}


	rdbms.query( queryText, queryValues, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err});

		if(result && result.rowCount == 0){

			res.status(500).json({ 'success': false, data: 'Operation Unsuccessful'} );

		}

		queryText = 'select * from "Users" where "id" = ($1)';

		queryValues = [req.user.id];

		rdbms.query( queryText, queryValues, function(err, rows, result){

			if(err) res.status(500).json({ 'success': false, data: err});


			if(!gift)
				return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': 'none', 'count':0, 'board': rows[0].board, 'board_state': rows[0].board_state  });

			else{

				if(gift === 'Y'){

					process.nextTick(function(){

						//Insert int Y_TRANSACTION

					});


					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].Y , 'board': rows[0].board, 'board_state': rows[0].board_state  });

				}else if(gift === 'Z'){

					process.nextTick(function(){

						//Insert int Z_TRANSACTION
						
					});

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].Z , 'board': rows[0].board, 'board_state': rows[0].board_state  });

				}else if(gift === 'a'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].a, 'board': rows[0].board, 'board_state': rows[0].board_state  });

				}else if(gift === 'b'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].b, 'board': rows[0].board, 'board_state': rows[0].board_state  });
					
				}else if(gift === 'c'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].c, 'board': rows[0].board, 'board_state': rows[0].board_state  });
					
				}else if(gift === 'd'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].d, 'board': rows[0].board, 'board_state': rows[0].board_state });
					
				}else if(gift === 'e'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].e, 'board': rows[0].board, 'board_state': rows[0].board_state  });
					
				}else if(gift === 'f'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].f, 'board': rows[0].board, 'board_state': rows[0].board_state  });
					
				}else if(gift === 'g'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].g, 'board': rows[0].board, 'board_state': rows[0].board_state  });
					
				}else if(gift === 'h'){

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': gift, 'count': rows[0].h, 'board': rows[0].board, 'board_state': rows[0].board_state  });
					
				}else{

					return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': 'none', 'count':0, 'board': rows[0].board, 'board_state': rows[0].board_state  });

				}


			}


		});

	});


};


Game.gameBoardUpdate = function(req, res){	

	if(req.user.game_state !== '111111111111111111111111111111111111111111111111')
		res.status(500).json({ 'success': false, data: 'Illegal Operation'} );

	var sum = 0;
	for(var i=0; i< req.user.board; i++ ){

		var x = req.user.board.charCodeAt(i);
		if(x>=97)
			x = x-97+25;
		else
			x = x-65+2;

		sum = sum + x;

	}

	var xp, level, xp_max, levelchange; 
	if( req.user.xp + sum > req.user.xp_max ){
		levelchange = true;
		level = req.user.level+1;
		xp_max = Math.ceil(196 + (24 * level) + (100 * Math.sin(level)));
		xp = (req.user.xp - req.user.xp_max)+sum;
	}else{
		levelchange = false;
		xp = req.user.xp+sum;
		level = req.user.level;
		xp_max = req.user.xp_max;
	}

	var jewelarray = board[level].jewels;
	var boundary = board[level].bounds;

	var gameboard = [];

	var max = boundary[boundary.length-1];

	for(var i=1; i<=48;i++){

		var random = Math.floor(Math.random() * (max + 1));

		for(var j=0; j<boundary.length; j++){

			if(random<=boundary[j]){
				gameboard[i-1] = jewelarray[j];
				break;
			}

		}

	}

	var gameboardstring = gameboard.join("");
	var gamestate = '000000000000000000000000000000000000000000000000';

	var	queryText = 'update "Users" SET "board" = ($1), "board_state" = ($2), "game_image" = "game_image" + 1, "level" = ($3), "xp_max" = ($4), "xp" = ($5)  where "id"=($6)';

	var queryValues = [ gameboardstring, gamestate, level, xp_max, xp, req.user.id ];		

	rdbms.query( queryText, queryValues, function(err, rows, result){

		if(err) res.status(500).json({ 'success': false, data: err} );


		queryText = 'select * from "Users" where "id" = ($1)';

		queryValues = [req.user.id];

		rdbms.query( queryText, queryValues, function(err, rows, result){

			if(err) res.status(500).json({ 'success': false, data: err} );

			return res.json({ 'A': rows[0].A, 'B': rows[0].B, 'C': rows[0].C, 'D': rows[0].D, 
					'Y': rows[0].Y, 'Z': rows[0].Z, 'LEVEL': rows[0].level , 'XP_MAX': rows[0].xp_max, 'XP': rows[0].xp,
					 'levelchange': levelchange, 'gift': 'none', 'count':0, 'board': rows[0].board, 'board_state': rows[0].board_state  });


		});


	});



};






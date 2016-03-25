'use strict';
var rdbms  = require('../../server/utils/query');


var Groups = module.exports;


Groups.getGroupsList = function(req, res) {


	var userId = req.user.id;

	//var queryText = 'select * from "GroupMembers" where "groupId" IN ( )';

	var queryText = 'select "Groups"."groupId", "Groups"."name", "Groups"."pic", "Groups"."status", "GroupMembers"."isAdmin" from "Groups" JOIN "GroupMembers" ON "Groups"."groupId"="GroupMembers"."groupId" where "GroupMembers"."userId"=($1)';

	var queryValues = [ userId ];

	rdbms.query( queryText, queryValues, function(err, rows, result){

	    if(err) res.status(500).json({ 'success' : false, data: err});

	    var mygroups = rows;

	    if(rows && rows.length==0)
	    	return res.json({ 'success' : true, 'mygroups': [], 'groupmembers': [] });

	    queryValues = [];

	    var params = [];
		for(var i = 1; i <= rows.length; i++) {
		  params.push('$' + i);
		  queryValues[i-1] = rows[i-1].groupId;
		}

	    queryText = 'select "Users"."id", "Users"."name", "Users"."pno", "Users"."gcmtoken", "Users"."image_current", "GroupMembers"."groupId", "GroupMembers"."isAdmin"  from "Users" JOIN "GroupMembers" ON "Users"."id"="GroupMembers"."userId" where "GroupMembers"."groupId" IN (' + params.join(',') + ' )';

		rdbms.query( queryText, queryValues, function(err, rows, result){

			if(err) res.status(500).json({ 'success' : false, data: err});

			return res.json({ 'success' : true, 'mygroups': mygroups, 'groupmembers': rows });


		});		    

	});

};






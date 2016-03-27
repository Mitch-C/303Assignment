var express = require('express');
var router = express.Router();
var basex = require('../databasequeries');
//var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
var cheerio = require('cheerio');


/* GET users listing. */
router.get('/', function(req, res, next) {
  basex.browseDatabase(req,function(err,data){if(err){console.log(err);}
res.render('browse', {title: 'Colenso Project', results: data});
});
		
});

router.get('/*', function(req, res, next){
	console.log('browse function has been called /*')
client.execute("LIST Colenso",
	function(error, result)
	{
		if (error)
		{
			res.render('browse', {title: 'Colenso Project', results: "Listing Error: " +error});
		}
		else
		{
			//console.log(result.result);
			/*
			  loop through result.result
			  every string section which has .xml at the end is the name and location of an xml document
			  paths are separated by /
			*/
			index = 0;
			file_paths = [];
			current_path = "";
			while(result.result.length>index)
			{
				if (result.result.charAt(index)==" ")
				{
					if (current_path.charAt(current_path.length-1)=='l'
					&& current_path.charAt(current_path.length-2)=='m'
					&& current_path.charAt(current_path.length-3)=='x'
					&& current_path.charAt(current_path.length-4)=='.')
					{
						file_paths.push(current_path);
						
					}
					current_path="";
				}
				else
				{
					current_path+=result.result.charAt(index);
				}
				index++;
			}
			file_paths[0]=file_paths[0].replace(/(-{3,})/gm,"");//remove large ammount of '-' character from the start.
			for (i = 0; i<file_paths.length; i++)//loop through each path
			{
				file_paths[i]=file_paths[i].replace(/(\r\n|\n|\r)/gm,"");//remove every possible type of linebreak from each path.
			}
			//console.log(file_paths);//TODO display all paths as a link to a new view page which will render the xml doccument.
			page_data="";//variable to store the html to be rendered
			page_data+="<table class=\"table-striped\">";
			page_data+="<thead><tr><th>File</th></tr></thead><tbody>";//head of table
			for (i = 0; i < file_paths.length; i++)
			{
				page_data+="<tr><td><a href=\"../view/?view="+file_paths[i]+"\">"+file_paths[i]+"</a></td></tr>";//generate a link to each doccument in a table.
			}
			//page_data+="</tbody></table>";
			res.render('browse', {title: 'Colenso Project', results: page_data});
		}
	});
});


module.exports = router;

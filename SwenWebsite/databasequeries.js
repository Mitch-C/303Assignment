var basex = require('basex');
var cheerio = require('cheerio');
var _ = require('underscore');

var fs = require('fs');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

// list of queries to be performed 
//query for search


function logicalOperator(query) {
 query = query.replace(/'/, "\\'");
  query = "'" + query + "'";
  query = query.replace(/\s+AND\s+/g, "\' ftand \'");
 query = query.replace(/\s+OR\s+/g, "\' ftor \'");
  query = query.replace(/\s+NOT\s+/g, "\' ftand ftnot \'");
  query = query.replace(/\s+NOR\s+/g, "\' ftor ftnot \'");
 console.log("query with logic removed" + query);
  return query;
}
exports.search = function(query, cb) {
 // console.log("is it removing properly " +query )
 // query = logicalOperator(query)
 var tempq = logicalOperator(query);
 tquery = " t " + "AND " +  "s"
 console.log("test query " + tquery);
    var myquery =
        "for $x in collection('colenso')\n" +
    "where $x//*:text[. contains text " + logicalOperator(query) + "]\n" +
   "return <li path='{ db:path($x) }'>{ $x//*:title }</li>";
    client.execute("XQUERY <result> { " + myquery + " } </result> ",
        function(err, data) {
            if (err) {
                console.log('ERROR');
                cb(err);
                return;
            }


            // console.log( 'print value of query'  + data.result);
            var cher = cheerio.load(data.result);
            var querylist = [];
            cher('li').each(function(i, elem) {
                querylist[i] = {
                    title: cher(this).text().trim(),
                    path: cher(this).attr('path')
                };
            });
            cb(undefined, querylist);
        });
    //console.log( 'print value of query'  );
};
//query for xpath search
exports.searchXPath = function(query, cb) {
console.log("xpath query:" + query)
    var myquery =
    "for $hit in collection('colenso')\n" +
    "where $hit" + query + "\n" +
    "return <li path='{ db:path($hit) }' title='{ $hit//*:title }'> { $hit" + query + "} </li>";
    client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';\n <result> { " + myquery + " } </result> ",
        function(err, data) {
            if (err) {
                console.log("xpath error:" + err)
                cb(err);
                return;
            }
            var cher = cheerio.load(data.result);
            var querylist = [];
            cher('li').each(function(i, elem) {
                querylist[i] = {
                    title: cher(this).text().trim(),
                    path: cher(this).attr('path')
                };
            });
            cb(undefined, querylist);
        });
};

exports.getDocument = function(path, cb) {
    client.execute("XQUERY doc('colenso" + (path + '.xml') + "')",
        function(err, data) {
            if (err) {
                cb(err);
                return;
            }
            cb(undefined, data.result);
        });
};
exports.XQuery = function(query, cb) {
    client.execute("XQUERY " + query,
        function(err, data) {
            if (err) {
                cb(err);                
            }
            else{
            client.searchRecord(query,'xquery',function(){}) ;
            cb(undefined, data);
            }
        });
};
exports.searchRecord = function(query, type, cb) {
  client.execute('open search');
  var xquery = 
    "XQUERY " +
    "let $search := <search type='" + type + "'>" + escape(query) + "</search>\n"+
    "return insert node $search as last into doc('search')/root";
  console.log(xquery);
  client.execute(
    xquery,
    function(err, data) {
      if (err) {
        cb(err);
        return;
      }
      cb(undefined, data.result);
    });
};

exports.browseDatabase = function(quer, cb) {
    client.execute("LIST Colenso",
        function(error, result) {
            if (error) {} else {
                //console.log(result.result);
                /*
                  loop through result.result
                  every string section which has .xml at the end is the name and location of an xml document
                  paths are separated by /
                */
                index = 0;
                file_paths = [];
                current_path = "";
                while (result.result.length > index) {
                    if (result.result.charAt(index) == " ") {
                        if (current_path.charAt(current_path.length - 1) == 'l' && current_path.charAt(current_path.length - 2) == 'm' && current_path.charAt(current_path.length - 3) == 'x' && current_path.charAt(current_path.length - 4) == '.') {
                            file_paths.push(current_path);
                           // console.log("current path" + current_path)
                        }
                        current_path = "";
                    } else {
                        current_path += result.result.charAt(index);
                    }
                    index++;
                }
                file_paths[0] = file_paths[0].replace(/(-{3,})/gm, ""); //remove large ammount of '-' character from the start.
                for (i = 0; i < file_paths.length; i++) //loop through each path
                {
                    file_paths[i] = file_paths[i].replace(/(\r\n|\n|\r)/gm, ""); //remove every possible type of linebreak from each path.
                file_paths[i] = file_paths[i].replace('.xml','/');
                }
                //console.log(file_paths); //TODO display all paths as a link to a new view page which will render the xml doccument.
                
                page_data = ""; //variable to store the html to be rendered
                page_data += "<table class=\"table-striped\">";
                page_data += "<thead><tr><th>File</th></tr></thead><tbody>"; //head of table
                for (i = 0; i < file_paths.length; i++) {
                    page_data += "<tr><td><a href=\"../results/" + file_paths[i] + "\">" + file_paths[i] + "</a></td></tr>"; //generate a link to each doccument in a table.
                }
                page_data += "</tbody></table>";
                cb(undefined, page_data);
            }
        }
    )
};
exports.addDocument = function(path, contents, cb)  {
  
 

  client.execute('open colenso');
 client.add(path, contents, function(err, data) {
    if (err) {
      console.log('validate error ' + err);
      cb(err);
      return;
    }
    console.log('added ' + path);
    cb(undefined, data);
  });

};


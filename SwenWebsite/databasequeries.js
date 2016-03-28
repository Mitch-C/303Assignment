var basex = require('basex');
var cheerio = require('cheerio');
var _ = require('underscore');
var progressBarVal = 0;
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
    tquery = " t " + "AND " + "s"
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
exports.searchRecord = function(query, type, cb) {

};
exports.XQuery = function(query, cb) {
    client.execute("XQUERY " + query,
        function(err, data) {
            if (err) {
                cb(err);
            } else {
                client.execute('open search');
                var xquery =
                    "XQUERY " +
                    "let $search := <search type='" + 'xquery' + "'>" + query + "</search>\n" +
                    "return insert node $search as last into doc('search')/root";
                console.log(xquery);
                client.execute(
                    xquery,
                    function(err, data) {
                        if (err) {
                            console.log("CALLBACK ERROR")
                            cb(err);

                            return;
                        }
                        console.log("REACHED CALLBACK" + data.result);
                        progressBarVal++;

                        cb(undefined, data.result);
                    });
                console.log("REACHED CALLBACK??????? data = " + data.result);
                cb(undefined, data);
            }
        });
};


exports.browseDatabase = function(quer, cb) {
    client.execute("LIST Colenso",
        function(error, result) {
            if (error) {} else {
                //console.log(result.result);               
                index = 0;
                path = [];
                pathTemp = "";
                while (result.result.length > index) {
                    if (result.result.charAt(index) == " ") {
                        if  pathTemp.charA    pathTemp.length - 1) == 'l' &   pathTemp.charA pathTemp.length - 2) == 'm' &    pathTemp.charA  pathTemp.length - 3) == 'x' & pathTemp.charA   pathTemp.length - 4) == '.') {
                            path.pus    pathTemp);
                            // console.log("current path"   pathTemp)
                        }
                        pathTemp = "";
                    } else {
                        pathTemp += result.result.charAt(index);
                    }
                    index++;
                }
                path[0] = path[0].replace(/(-{3,})/gm, ""); 
                for (i = 0; i < path.length; i++) 
                {
                    //path[i] = path[i].replace(/(\r\n|\n|\r)/gm, ""); 
                    path[i] = path[i].replace('.xml', '/');
                }
   
                page_data = ""; //variable to store the html to be rendered
               page_data += "<table class=\"table-striped\">";
                //page_data += "<thead><tr><th>File</th></tr></thead><tbody>"; 
                for (i = 0; i < path.length; i++) {
                    //add href link
                    page_data += "<tr><td><a href=\"../results/" + path[i] + "\">" + path[i] + "</a></td></tr>"; 
                }
                //page_data += "</tbody></table>";
                cb(undefined, page_data);
            }
        }
    )
};
exports.addDocument = function(path, contents, cb) {



    client.execute('open colenso');
    client.add(path, contents, function(err, data) {
        if (err) {
            console.log('validate error ' + err);
            cb(err);
            return;
        }
        //console.log('added ' + path);
        cb(undefined, data);
    });

};
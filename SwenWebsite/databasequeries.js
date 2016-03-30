var basex = require('basex');
var cheerio = require('cheerio');
var _ = require('underscore');


var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

// list of queries to be performed 


//allow for the use of logical operators
function logicalOperator(q) {
    q = q.replace(/'/, "\\'");
    q = "'" + q + "'";
    q = q.replace(/\s+AND\s+/g, "\' ftand \'");
    q = q.replace(/\s+OR\s+/g, "\' ftor \'");
    q = q.replace(/\s+NOT\s+/g, "\' ftand ftnot \'");
    q = q.replace(/\s+NOR\s+/g, "\' ftor ftnot \'");
    console.log("query with logic removed" + q);
    return q;
}

//query for search
exports.search = function(query, callb) {
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
                callb(err);
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
            callb(undefined, querylist);
        });
    //console.log( 'print value of query'  );
};
//query for xpath search
exports.searchXPath = function(query, callb) {

    console.log("xpath query:" + query)
    var myquery =
        "for $hit in collection('colenso')\n" +
        "where $hit" + query + "\n" +
        "return <li path='{ db:path($hit) }' title='{ $hit//*:title }'> { $hit" + query + "} </li>";
    client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';\n <result> { " + myquery + " } </result> ",
        function(err, data) {
            if (err) {
                console.log("xpath error:" + err)
                callb(err);
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
            console.log('')
            callb(undefined, querylist);
        });
};

exports.getDocument = function(path, callb) {
    client.execute("XQUERY doc('colenso" + (path + '.xml') + "')",
        function(err, data) {
            if (err) {
                callb(err);
                return;
            }
            callb(undefined, data.result);
        });
};

exports.XQuery = function(query, callb) {
    client.execute("XQUERY " + query,
        function(err, data) {
            if (err) {
                callb(err);
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
                            callb(err);

                            return;
                        }
                        console.log("REACHED CALLBACK" + data.result);
                        progressBarVal++;

                        callb(undefined, data.result);
                    });
                console.log("REACHED CALLBACK??????? data = " + data.result);
                callb(undefined, data);
            }
        });
};


exports.browseDatabase = function(quer, callb) {
    client.execute("LIST Colenso",
        function(error, result) {
            if (error) {} else {

                index = 0;
                path = [];
                pathtemp = "";
                while (result.result.length > index) {
                    if (result.result.charAt(index) == " ") {
                        if (pathtemp.charAt(pathtemp.length - 1) == 'l' && pathtemp.charAt(pathtemp.length - 2) == 'm' && pathtemp.charAt(pathtemp.length - 3) == 'x' && pathtemp.charAt(pathtemp.length - 4) == '.') {
                            path.push(pathtemp);
                        }
                        pathtemp = "";
                    } else {
                        pathtemp += result.result.charAt(index);
                    }
                    index++;
                }
                path[0] = path[0].replace(/(-{3,})/gm, "");
                for (i = 0; i < path.length; i++) {

                    path[i] = path[i].replace('.xml', '/');
                }

                page = "";
                page += "<table class=\"table-striped\">";
                for (i = 0; i < path.length; i++) {
                    //add href link
                    page += "<tr><td><a href=\"../results/" + path[i] + "\">" + path[i] + "</a></td></tr>";
                }
                callb(undefined, page);
            }
        }
    )
};

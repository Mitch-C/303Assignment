var basex = require('basex');
var cheerio = require('cheerio');
var _ = require('underscore');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

// list of queries to be performed 

exports.search = function(query, cb){
var xquery =
    "for $x in collection('colenso')\n" +
    "where $x//*:text[descendant::text() contains text '" + query + "']\n" +
    "return <li path='{ db:path($x) }'>{ $x//*:title }</li>";
  client.execute("XQUERY <result> { " + xquery + " } </result> ",
                function(err, data) {
    if (err) {
      console.log( 'ERROR'  );
    cb(err);
    return;
    }

    console.log( 'print value of query'  + data.result);
    var $ = cheerio.load(data.result);
    var list = [];
    $('li').each(function(i, elem) {
    list[i] = { title: $(this).text().trim(),
      path: $(this).attr('path')
    };
    });
    cb(undefined, list);
    });
 //console.log( 'print value of query'  );
};
var basex = require('basex');
var cheerio = require('cheerio');
var _ = require('underscore');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

// list of queries to be performed 
//query for search
exports.search = function(query, cb){
var myquery =
    "for $x in collection('colenso')\n" +
    "where $x//*:text[descendant::text() contains text '" + query + "']\n" +
    "return <li path='{ db:path($x) }'>{ $x//*:title }</li>";
  client.execute("XQUERY <result> { " + myquery + " } </result> ",
    function(err, data) {
    if (err) {
      console.log( 'ERROR'  );
    cb(err);
    return;
    }

   // console.log( 'print value of query'  + data.result);
    var cher = cheerio.load(data.result);
    var querylist = [];
    cher('li').each(function(i, elem) {
    querylist[i] = { title: cher(this).text().trim(),
      path: cher(this).attr('path')
    };
    });
    cb(undefined, querylist);
    });
 //console.log( 'print value of query'  );
};
//query for xpath search
exports.searchXPath = function(query, cb) {
  var myquery =
    "for $hit in collection('colenso')\n" +
    "where $hit" + query + "\n" +
    "return <li path='{ db:path($hit) }'>{ $hit//*:title }</li>";
    client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';\n <result> { " + myquery + " } </result> ",
    function(err, data) {
    if (err) {
    cb(err);
    return;
    }
    var cher = cheerio.load(data.result);
    var querylist = [];
    cher('li').each(function(i, elem) {
    querylist[i] = { title: cher(this).text().trim(),
      path: cher(this).attr('path')
    };
    });
    cb(undefined, querylist);
    });
};

exports.getDocument = function(path, cb) {
 client.execute("XQUERY doc('colenso" + path + "')",
                function(err, data) {
                  if (err) {
                    cb(err);
                    return;
                  }
                  cb(undefined, data.result);
                });
};
exports.XQuery = function(query, cb) {
  this.execute("XQUERY " + query,
                function(err, data) {
                  if (err) {
                    cb(err);
                    return;
                  }
                  cb(undefined, data);
                });
};
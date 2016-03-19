var basex = require('basex');
var cheerio = require('cheerio');
var _ = require('underscore');

// list of queries to be performed 

basex.Session.exports.method.search = function(query, cb){
var newquery = "for $x in collection('colenso')\n" + "where $x//*text[descendent::text() contains text'" + query +"']\n" 
+ "return <li path='{ db:path($x) }'>{ $x//*:title }</li>";
this.execute("XQUERY <result>{" + newquery + "}<lresullt>",
  function(err, data) {
    if (err) {
    cb(err);
    return;
    }
    var $ = cheerio.load(data.result);
    var list = [];
    $('li').each(function(i, elem) {
    list[i] = { title: $(this).text().trim(),
      path: $(this).attr('path')
    };
    });
    cb(undefined, list);
    });
};
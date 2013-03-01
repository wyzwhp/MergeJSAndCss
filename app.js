
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var static_dir = __dirname + '/public';
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.static(static_dir));
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

app.configure('production', function() {
  var one_year = 31557600000;
  app.use(express.static(static_dir, {
    maxAge : 50000
  }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});
var routings = require(__dirname + '/routes.js').routings;
for(var r in routings){
    var pf = require(__dirname + routings[r].file)[routings[r].processFunction];
    if(routings[r].method == 'get')
        app.get(r, pf,function(req, res){});
    else if(routings[r].method == 'post')
        app.post(r,pf);
    else
        app.all(r, pf,function(req, res){});
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

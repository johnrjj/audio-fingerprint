// var express = require('express');
// var app = express();
// var http = require('http');
// var httpServer = http.Server(app);

// app.use(express.static(__dirname+'/public'));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });
// app.listen(3001);

var express = require('express');
var path = require('path');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3001;
var publicPath = path.resolve(__dirname);
console.log(publicPath);

// We point to our static assets
app.use(express.static(publicPath));

// And run the server
app.listen(port, function () {
  console.log('Server running on port ' + port);
});

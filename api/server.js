'use strict';
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
let url = 'mongodb://localhost:27017/musicindexer1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var router = express.Router();

app.use('/api', router);

app.listen(port);

router.get('/', function(req, res) {
    res.json({ message: 'hello world' });
});

router.route('/fingerprint')
    .post(function(req, res) {
      console.log(req.body);
      MongoClient.connect(url, function(err, db) {
        var collection = db.collection('fingerprints');
      });
      res.json({
        'hue': 'hue',
      });
    });
    
console.log('api running on port:' + port);

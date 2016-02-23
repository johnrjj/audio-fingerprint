'use strict';
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
let url = 'mongodb://localhost:27017/musicindexer1';

var matcher = require('../lib/audio-matcher');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var port = process.env.PORT || 8001;
var router = express.Router();

app.use('/api', router);

app.listen(port);

router.get('/', function(req, res) {
    res.json({ message: 'hello world' });
});

router.route('/fingerprint')
    .post(function(req, res) {
      console.log(req.body);
      // MongoClient.connect(url, function(err, db) {
      //   var collection = db.collection('fingerprints');
      // });
      let fingerprints = req.body;
      let matches = matcher(fingerprints);

      res.json({
        'hue': 'hue',
      });
    });

console.log('api running on port:' + port);

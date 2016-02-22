'use strict';
var fs = require('fs');
var AudioContext = require('web-audio-api').AudioContext;
var argv = require('yargs').argv;
var _ = require('lodash');
var glob = require('glob');
var context = new AudioContext();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var fingerprinter = require('../lib/audio-fingerprint');

function dbInteract(objArray, dbUrl, callback) {
  let url = dbUrl;
  url = 'mongodb://localhost:27017/musicindexer1';
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.collection('fingerprints').drop();
    var collection = db.collection('fingerprints');
    var bulk = collection.initializeUnorderedBulkOp();
    _.forEach(objArray, obj => {
      bulk.insert(obj);
    });
    let result = bulk.execute((err, result) => {
      if(err) throw err;
      db.close();
      callback(result);
    });
  });
}

function globAudioFiles(startingDirectory, options, audioFileTypes) {
  return glob("../lib//audio_files/tswift/1989/**/*", options, (er, files) => {
    var filtered = _.filter(files, file => {
      if (~file.indexOf('.mp3')) {
        return true;
      }
      return false;
    });
    filtered.forEach((path) => {
      console.log(path);
      analyzeFile(path, null);
    });
  });
}

function analyzeFile(path, cb) {
  fs.readFile(path,  function (err, data ) {
    console.log('reading data');
    context.decodeAudioData(data, function(decodedData) {
      var signal = decodedData.getChannelData(0);
      var res = fingerprinter(signal, 44100, 11025, path);
      dbInteract(res, 'mongodb://localhost:27017/musicindexer', (resFromDb) => {
        console.log('done uploading' + path);
        return;
      });
      return;
    });
  });
};

globAudioFiles(null, null, null);

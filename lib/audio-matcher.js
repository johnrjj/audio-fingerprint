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
var fingerprinter = require('./audio-fingerprint');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function dbInteract(objArray, dbUrl, callback) {
  let url = dbUrl;
  url = 'mongodb://localhost:27017/musicindexer1';
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
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


function analyzeFile(path, cb) {
  console.log(path);
  fs.readFile(path,  function (err, data ) {
    console.log('reading data');
    context.decodeAudioData(data, function(decodedData) {
      var signal = decodedData.getChannelData(0);
      var res = fingerprinter(signal, 44100, 11025, path);
      compare(res);
      // console.log(res);
      return;
    });
  });
};

function compare(fingerprints) {
  console.log('in compare');

  let encodedAddresses = fingerprints.map((fingerprint) => {
    return fingerprint.encodedAddress;
  })

  let url = '';
  url = 'mongodb://localhost:27017/musicindexer1';
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");
    var collection = db.collection('fingerprints');
    var cursor = collection.find( { encodedAddress: { $in: encodedAddresses } }).toArray(function(err, items) {
      db.close();
      let groupedBySong = _.groupBy(items, match => {
        return match.songMetadata;
      });

      let groupedBySongFilteredOnlyFullTargetZones = _.map(groupedBySong, song => {
        let groupedByTargetZone =  _.groupBy(song, key => {
          return key.absTimeOfAnchor;
        });
        let filteredTargetZonesForSong = _.filter(groupedByTargetZone, targetZoneCollection => {
          // if the collection contains 3 or more points in the 5 point target zone, lets keep it
          if(targetZoneCollection.length >= 5)
            return true;
          return false;
        });
        let flattened = _.flatten(filteredTargetZonesForSong);
        // if(flattened.length > 0 ) {
        //   console.log('res:');
        //   console.log(flattened[0].songMetadata);
        //   console.log(flattened.length);
        // }
        return flattened;
      });

      let grouped = groupedBySongFilteredOnlyFullTargetZones;
      let j = _.sortBy(grouped, (o) => {
        return o.length;
      });
      grouped = _.takeRight(j, 2);
      // _.forEach(grouped, group => {
      //     console.log(group[0].songMetadata);
      //     console.log(group.length);
      // });

      let stuff = _.map(grouped, song => {
        let deltas = _.map(song, point => {
          return _.map(fingerprints, fingerprint => {
            return point.absTimeOfAnchor - fingerprint.absTimeOfAnchor;
          });
        });
        let deltasFlat = _.flattenDeep(deltas);
        let groupedDeltas = _.groupBy(deltasFlat, delta => {
          return delta;
        });
        let countPerDelta = _.map(groupedDeltas, deltaGroup => {
          return {
            delta: deltaGroup[0],
            deltaLength: deltaGroup.length
          }
          // return deltaGroup.length;
        });

        let max = _.max(countPerDelta, delta => {
          return delta.deltaLength;
        });
        console.log('res');
        console.log(max);
        console.log(song[0].songMetadata);

        let listOfUniqDeltas = _.uniq(deltasFlat);
      });
    });
  });
}

module.exports = compare;

analyzeFile('./audio_files/tswift/leanon.m4a', null);
// analyzeFile('./audio_files/tswift/photograph.m4a', null);
// analyzeFile('./audio_files/tswift/bieber.m4a', null);

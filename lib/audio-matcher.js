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
      console.log(res.length)
      // dbInteract(res, 'mongodb://localhost:27017/musicindexer', (resFromDb) => {
      //   console.log('done uploading' + path);
      //   return;
      // });

      compare(res);
      // console.log(res);
      return;
    });
  });
};

function compare(fingerprints) {
  let encodedAddresses = fingerprints.map((fingerprint) => {
    return fingerprint.encodedAddress;
  })
  // console.log(encodedAddresses);

  let url = '';
  url = 'mongodb://localhost:27017/musicindexer1';
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");
    var collection = db.collection('fingerprints');
    var cursor = collection.find( { encodedAddress: { $in: encodedAddresses } }).toArray(function(err, items) {
      db.close();
      let grouped = _.groupBy(items, 'songMetadata');
      // console.log(grouped);
      let j = _.sortBy(grouped, (o) => {
        return o.length;
      });
      grouped = _.takeRight(j, 5);
      _.forEach(grouped, group => {
          console.log(group[0].songMetadata);
          console.log(group.length);
      })

      let final = _.map(grouped, group => {
        return _.map(group, data => {
          return _.map(fingerprints, fingerprint => {
            let t = (fingerprint.absTimeOfAnchor - data.absTimeOfAnchor) * 1000;
            let t2 = Math.abs(t);
            let t3 = Math.floor(t2);
            let t4 = pad(t3, 6);
            return t4;
          });
        });
      });

      let finalFlat = _.flattenDeep(final);
      // console.log(groupedDeltas);
      // let listOfDeltas = finalFlat;
      let listOfDeltas = _.uniq(finalFlat);
      // console.log(listOfDeltas.length);
      // console.log('here');

      // for each song group
      let res2 = _.map(grouped, group => {
        console.log('siiiiit')
        let totals = _.map(listOfDeltas, delta => {
          // console.log('takes long');

          let totalCorresponding =  _.reduce(group, (total, datapoint) => {
            let count =  _.reduce(fingerprints, (sum, fingerprint) => {
              let t = (fingerprint.absTimeOfAnchor - datapoint.absTimeOfAnchor) * 1000;
              let t2 = Math.abs(t);
              let t3 = Math.floor(t2);
              let t4 = pad(t3, 6);
              if (t4 == delta) {
                // console.log('got one');
                return sum+1;
              }
              // else if(Math.abs(t4 - delta) < 100){
              //   // console.log('close call for' +  datapoint.songMetadata);
              //   return sum+1;
              //
              // }
              return sum;
            }, 0);
            return total + count;
          }, 0);
          return totalCorresponding;
          // let deltaOccurCount = groupedDeltas[delta].length;

          // return totalCorresponding * deltaOccurCount;
          // return {
          //   totalCorresponding: totalCorresponding,
          //   delta: delta
          // };

          // let final = _.max(totals);
          // console.log(final);
        });
        // console.log(totals);
        let final = _.max(totals);
        // console.log(final);
        // console.log(final);
        return {
          name: group[0].songMetadata,
          max: final,
        }
        // return final;
        // totals.max
      });
      console.log(res2);
    });
    // Execute the each command, triggers for each document

    // var arr = [];
    // cursor.each(function(err, item) {
    //
    //   // // If the item is null then the cursor is exhausted/empty and closed
    //   if(item == null) {
    //
    //     // Show that the cursor is closed
    //     cursor.toArray(function(err, items) {
    //       // assert.ok(err != null);
    //       db.close();
    //       // Let's close the db
    //     });
    //   }
    //   // else {
    //   // console.log(item);
    //     arr.push(_.clone(item));
    //   // }
    // });




    // console.log(arr);
    // console.log('test');
    // assert.equal(null, err);
    // console.log(result);
    // console.log("Connected correctly to server");
    // var collection = db.collection('fingerprints');
    // var bulk = collection.initializeUnorderedBulkOp();
    // _.forEach(objArray, obj => {
    //   bulk.insert(obj);
    // });
    // let result = bulk.execute((err, result) => {
    //   if(err) throw err;
    // db.close();
    //   callback(result);
    // });
  });

  // db.inventory.find( { qty: { $in: [ 5, 15 ] } } )
}

analyzeFile('./audio_files/tswift/new.m4a', null);

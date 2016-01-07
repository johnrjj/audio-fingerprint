'use strict';
var fs 			  = require('fs');
var AudioContext  = require('web-audio-api').AudioContext;
var argv 		  = require('yargs').argv;
var _ 			  = require('lodash');
var Hasher   	  = require('./audioHasher');
var time     	  = require('./audioChrono');
var glob		  = require('glob');
var context 	  = new AudioContext();

var MongoClient   = require('mongodb').MongoClient;
var assert 		  = require('assert');


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';

function dbInteract(hashes, dbUrl, callback) {
	// Connection URL
	let url = dbUrl;
	url = 'mongodb://localhost:27017/musicindexer';
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server");
	    // Get the documents collection
		var collection = db.collection('hashes');
	  	// Insert some documents
		var bulk = collection.initializeUnorderedBulkOp();

		_.forEach(hashes, hash => {
			bulk.insert(hash);
		});
		let result = bulk.execute();

		db.close();

		callback(result);
		// bulk.insert( { item: "abc123", defaultQty: 100, status: "A", points: 100 } );
		// bulk.insert( { item: "ijk123", defaultQty: 200, status: "A", points: 200 } );
		// bulk.insert( { item: "mop123", defaultQty: 0, status: "P", points: 0 } );
		// bulk.execute();






	  // collection.insertMany([
	  //   {a : 1}, {a : 2}, {a : 3}
	  // ], function(err, result) {
	  //   assert.equal(err, null);
	  //   assert.equal(3, result.result.n);
	  //   assert.equal(3, result.ops.length);
	  //   console.log("Inserted 3 documents into the document collection");
	  //   console.log(result);
   //  	db.close();
	  // });

		// var hashesObj = _.map(hashes, function(hash, ix) {
		// 	return {
		// 		hash: hash,
		// 		timeDelta: getTimeOffset(ix)
		// 	};
		// });
		// console.log(hashesObj);
		// return hashesObj;


	});
}



function globAudioFiles(startingDirectory, options, audioFileTypes) {
	glob("**/*", options, (er, files) => {

		var blankspaces = _.filter(files, file => {
		// 	console.log(file);
			if(~file.indexOf('Blank Space')) {
				return true;
				// analyzeFile(file);

			} 
			return false;
		});
		console.log(blankspaces);
		console.log(blankspaces[0]);
		console.log(blankspaces[1]);

		var orgi = analyzeFile(blankspaces[0], orighashes => {


			var hashesObj = _.map(hashes, function(hash, ix) {
				return {
					hash: hash,
					timeDelta: getTimeOffset(ix)
				};
			});


			// console.log(hashesObj);
			// return hashesObj;



			var rec  = analyzeFile(blankspaces[1], rechashes => {
				console.log('is this blocking');
				console.log('if not we need a callback');

				console.log(orighashes.length);
				console.log(rechashes.length);




				// var matches = _.filter(rechashes, recordingDataPoint => {
				// 	return _.includes(orighashes, recordingDataPoint);
				// });
				// 	// if ( orighashes.contains(recordingDataPoint)) {
				// 	// 	return recordingDataPoint
				// 	// }
				// console.log(matches);
				// console.log(matches.length);
			});
		});
	});
}


function analyzeFile(path, cb) {
	// fs.readFile(path,  function (err, data ) {
	fs.readFile('./audio_files/440hz.mp3',  function (err, data ) {
		// console.log(data);
		context.decodeAudioData(data, function(decodedData) {
			// console.log(Object.getOwnPropertyNames(decodedData));

			var hash = Hasher.createAudioHasher({
				'sampleRate': decodedData.sampleRate,
			});
			// var i = hasher.computeRawTimeOffset(42);
			// console.log(i);

			// let bufferChunks = 	_.chain(decodedData.getChannelData(0))
			// 		.chunk(4096)
	  //  				.dropRight() 
			// 		.value();

			// var hashes = computeHashesForChunks(bufferChunks);
			// console.log(hasher);
			// console.log(Object.)
	  	  var hashes = hash.transform(decodedData.getChannelData(0));
	  	  // console.log(hashes);
	  	  cb(hashes);
		});
	});
};


analyzeFile(null, (hashes) => {
	// console.log(hashes);

	let hashesWithTimeOffset = time.hashesToHashObjectWithTimeOffset(hashes);
	console.log(hashesWithTimeOffset);

	dbInteract(hashesWithTimeOffset, 'mongodb://localhost:27017/musicindexer', dbresult => {
		console.log(dbresult);
	});
});

// dbInteract();
// test();
// globAudioFiles(null, null, null);
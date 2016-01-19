'use strict';
var fs = require('fs');
var AudioContext = require('web-audio-api').AudioContext;
var argv = require('yargs').argv;
var _ = require('lodash');
var Hasher = require('./audioHasher');
var time = require('./audioChrono');
var glob = require('glob');
var context = new AudioContext();
var downsample = require('./audio-downsampler');
var audioConverter = require('./audio-convert');
var audioExtracter = require('./audio-extract');
var audioTimeOffset = require('./audio-timeoffset');
var targetZoneGenerator = require('./generate-target-zone');

function testme(path, cb) {
  fs.readFile('./audio_files/440hz.mp3', function(err, data) {
    context.decodeAudioData(data, function(decodedData) {
      var signal = decodedData.getChannelData(0);

      var converted = audioConverter(signal, 44100, 11025, 1024)

      var extracted = audioExtracter(converted);

      var sit = audioTimeOffset(extracted, 1024, 11025, 0);

      var flattenedSit = _.flatten(sit);

      // targetZoneGenerator(flattenedSit);

      console.log(flattenedSit);

      console.log('generating target zones');
      targetZoneGenerator(flattenedSit, 3, 5);

      // console.log(converted);
      // console.log(signal);

      // console.log(converted);

      // var downsampled = downsample(signal, 44100, 11025, 1024);

      // var hash = Hasher.createAudioHasher({
      //   'sampleRate': 11025,
      //   'chunkSize': 1024,
      // });

      // console.log(hash.transform(downsampled)[5]);
    });
  });
};

testme(null, null);

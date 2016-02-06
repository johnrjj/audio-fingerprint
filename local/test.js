// require('babel-register')({
//    presets: [ 'es2015' ]
// });
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
var addressLinkGenerator = require('./generate-address-link');
var merger = require('./merge-address-link');
var math = require('./math-util');

function testme(path, cb) {
  fs.readFile('./audio_files/22.mp3', function(err, data) {
    context.decodeAudioData(data, function(decodedData) {
      // Get the raw PCM signal
      var signal = decodedData.getChannelData(0);
      // console.log(signal.length);
      //  Downsample signal, then run FFT on it
      var converted = audioConverter(signal, 44100, 11025, 1024)
      // console.log(converted.length);
      // Group audio into windows, then group frequencies into bins per window
      var extracted = audioExtracter(converted);
      // console.log(extracted.length);
      // console.log(extracted);
      // Apply timeoffsets to all audio data points (right now theyre all in order)
      var extractedWithTimeOffsets = audioTimeOffset(extracted, 1024, 11025, 0);
      // console.log(extractedWithTimeOffsets);
      // console.log(extractedWithTimeOffsets);

      // Flatten the list, now that we have the chosen audio points w/ correct time offsets
      var flattenedExtractedAudio = _.flatten(extractedWithTimeOffsets);

      // console.log(flattenedExtractedAudio);
      // console.log(flattenedExtractedAudio.length);

      var targetZones = targetZoneGenerator(flattenedExtractedAudio, 3, 5);
      // console.log(targetZones);

      // console.log(targetZones.length);
      // console.log(targetZones);

      var addressLinks = addressLinkGenerator(flattenedExtractedAudio, 0, 1337);

      var merged = merger(targetZones, addressLinks);
      // console.log(addressLinks.length);
      // console.log(addressLinks);
      // console.log(addressLinks);
    });
  });
};

testme(null, null);

'use strict';
var fs = require('fs');
var AudioContext = require('web-audio-api').AudioContext;
var argv = require('yargs').argv;
var _ = require('lodash');
var Hasher = require('./audioHasher');
var time = require('./audioChrono');
var glob = require('glob');
var context = new AudioContext();
var downsample = require('./audioDownSampler');

function testme(path, cb) {
  fs.readFile('./audio_files/440hz.mp3', function(err, data) {
    context.decodeAudioData(data, function(decodedData) {
      var signal = decodedData.getChannelData(0);

      var downsampled = downsample(signal, 44100, 11025);

      var hash = Hasher.createAudioHasher({
        'sampleRate': 11025,
        'chunkSize': 1024,
      });

      console.log(hash.transform(downsampled));

    });
  });
};

testme(null, null);

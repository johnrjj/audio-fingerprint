'use strict';
var fs = require('fs');
var AudioContext = require('web-audio-api').AudioContext;
var argv = require('yargs').argv;
var _ = require('lodash');
var glob = require('glob');
var context = new AudioContext();

var fingerprinter = require('./audio-fingerprint');

function testme(path, cb) {
  fs.readFile('./audio_files/22.mp3', function(err, data) {
    context.decodeAudioData(data, function(decodedData) {
      // Get the raw PCM signal
      var signal = decodedData.getChannelData(0);
      // console.log(signal.length);
      var res = fingerprinter(signal, 44100, 11025);
      console.log(res);
      console.log(res.length);
    });
  });
};

testme(null, null);

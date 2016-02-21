'use strict';
var _ = require('lodash');
// var downsample = require('./audio-downsampler');
var audioConverter = require('./audio-convert');
var audioExtracter = require('./audio-extract');
var audioTimeOffset = require('./audio-timeoffset');
var targetZoneGenerator = require('./generate-target-zone');
var math = require('./math-util');

module.exports = function(signal, sampleRateOfRecording, desiredSamplingRate, signalMetadata) {
  console.log('wtf');
  //  Downsample signal, then run FFT on it
  var converted = audioConverter(signal, sampleRateOfRecording, desiredSamplingRate, 1024)
  // console.log(converted.length);
  // Group audio into windows, then group frequencies into bins per window
  var extracted = audioExtracter(converted);
  // Apply timeoffsets to all audio data points (right now theyre all in order)

  var extractedWithTimeOffsets = audioTimeOffset(extracted, 1024, desiredSamplingRate, 0);

  // Flatten the list, now that we have the chosen audio points w/ correct time offsets
  var flattenedExtractedAudio = _.flatten(extractedWithTimeOffsets);

  var targetZones = targetZoneGenerator(flattenedExtractedAudio, 3, 5, signalMetadata);

  var targetZonesFlattened = _.flatten(targetZones);
  return targetZonesFlattened;
};

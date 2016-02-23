'use strict';
var _ = require('lodash');
var audioConverter = require('./audio-convert');
var audioExtracter = require('./audio-extract');
var audioTimeOffset = require('./audio-timeoffset');
var targetZoneGenerator = require('./generate-target-zone');

module.exports = function(signal, sampleRateOfRecording, desiredSamplingRate, signalMetadata) {
  //  Downsample signal, then run FFT on it
  // console.log('here in fingerprint');
  // console.log(signal.length);

  var converted = audioConverter(signal, sampleRateOfRecording, desiredSamplingRate, 1024)
  // Group audio into windows, then group frequencies into bins per window
  // console.log(converted.length);
  var extracted = audioExtracter(converted);

  // Apply timeoffsets to all audio data points (right now theyre all in order)
  var extractedWithTimeOffsets = audioTimeOffset(extracted, 1024, desiredSamplingRate, 0);
  // console.log(extractedWithTimeOffsets.length);
  // console.log('next value will be empty???');
  // Flatten the list, now that we have the chosen audio points w/ correct time offsets
  var flattenedExtractedAudio = _.flatten(extractedWithTimeOffsets);
  // console.log(flattenedExtractedAudio.length);

  var targetZones = targetZoneGenerator(flattenedExtractedAudio, 3, 6, signalMetadata);

  // console.log(targetZones.length);
  var targetZonesFlattened = _.flatten(targetZones);
  // console.log(targetZonesFlattened.length);
  // console.log('done in fingerprint, returning');
  // console.log(targetZonesFlattened);
  return targetZonesFlattened;
};

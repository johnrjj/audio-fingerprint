// Driver - takes an audio signal, downsamples, then fast fourier transforms the signal,
// and returns the transformed windows in an array.
'use strict';
var _ = require('lodash');
var downsampler = require('./audio-downsampler');
var fft = require('./audio-fft');

function convert(signal, originalFrequency, targetFrequency, windowSize) {
  let downsampled = downsample(signal, originalFrequency, targetFrequency, windowSize);
  let audioWindows = _.chunk(downsampled, windowSize);
  let transformedWindows = _.map(audioWindows, audioWindow => {
    return fft(audioWindow, windowSize);
  });
  console.log(transformedWindows);
};

// module.exports = {
//
// };

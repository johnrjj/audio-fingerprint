// Driver - takes an audio signal, downsamples, then fast fourier transforms the signal,
// and returns the transformed windows in an array.
'use strict';
var _ = require('lodash');
var downsample = require('./audio-downsampler');
var fft = require('./audio-fft');

function convert(signal, originalFrequency, targetFrequency, windowSize) {
  // Downsample audio to spec
  let downsampled = downsample(signal, originalFrequency, targetFrequency, windowSize);
  // Divide the downsampled audio into windows (chunks)
  let audioWindows = _.chunk(downsampled, windowSize);
  // If incomplete chunk at the end (wasn't chunk.length % windowSize != 0), toss it
  if (_.last(audioWindows).length < windowSize) {
    audioWindows = _.dropRight(audioWindows);
  }
  // Run FFT on each window
  let transformedWindows = _.map(audioWindows, audioWindow => {
    return fft(audioWindow, windowSize);
  });
  return transformedWindows;
};

module.exports = convert;

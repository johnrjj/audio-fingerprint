// Driver - takes an audio signal, downsamples, then fast fourier transforms the signal,
// and returns the transformed windows in an array.
'use strict';
let _ = require('lodash');
let downsample = require('./audio-downsampler');
let fft = require('./audio-fft');

module.exports = function(signal, originalFrequency, targetFrequency, windowSize) {
  // Downsample audio to spec
  let downsampled = downsample(signal, originalFrequency, targetFrequency, windowSize);
  // console.log(downsampled.length);
  // Divide the downsampled audio into windows (chunks)
  let audioWindows = _.chunk(downsampled, windowSize);
  // If incomplete chunk at the end (chunk.length % windowSize != 0), toss it
  if (_.last(audioWindows).length < windowSize-1) {
    audioWindows = _.dropRight(audioWindows);
  }
  // Run FFT on each window
  let transformedWindows = _.map(audioWindows, (audioWindow) => {
    return fft(audioWindow, windowSize); // oh shit should this be targetFrequency ??!??!?!!?!??
  });
  return transformedWindows;
};

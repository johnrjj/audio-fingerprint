// Does a FFT based off the sample rate and signal
/*eslint-disable */
'use strict';
let fft = require('fft-js').fft;
let fftUtil = require('fft-js').util;

module.exports = function(signal, sampleRate) {
  let phasors = fft(signal);
  let frequencies = fftUtil.fftFreq(phasors, sampleRate),
    magnitudes = fftUtil.fftMag(phasors);
  let frequencyAndMagnitudeArray = frequencies.map(function(f, ix) {
    return {
      frequency: f,
      magnitude: magnitudes[ix]
    };
  });
  return frequencyAndMagnitudeArray;
};

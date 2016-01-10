// Downsampling using a low-pass filter, linear inteprelation decimation, then hamming window
'use strict';
var _ = require('lodash');
var windowFilter = require('./audio-window-filter');
var decimator = require('./audio-decimator');
var dsp = require('./dsp');

module.exports = function(signal, origFrequency, targetFrequency, windowLength) {
  var windowLength = windowLength || signal.length;
  if (origFrequency < targetFrequency) {
    throw 'Target frequency must be smaller than original frequency to downsample';
  } else if (origFrequency % targetFrequency != 0) {
    throw 'Frequencies must be divisible by an integer factor.';
  } else if (origFrequency == targetFrequency) {
    throw 'Implement optimization for same freqs';
  }
  // Create low-pass filter to get signal ready for downsampling
  // tldr: IIRFilter(filtertype, cutoff frequency, resonance, original frequency)
  let cutoffFrequency = Math.floor(targetFrequency/2);
  let filter = new dsp.IIRFilter(dsp.LOWPASS, cutoffFrequency, 1, origFrequency);
  // Apply low-pass filter in place
  filter.process(signal);
  //Decimate signal to factor we want
  let decimateFactor = Math.floor(origFrequency / targetFrequency);
  let decimatedSignal = decimator(signal, decimateFactor);
  // Applying hamming window to prevent spectrum leakage, in place
  let chunksToWindowFilter = _.chunk(decimatedSignal, windowLength);
  _.forEach(chunksToWindowFilter, chunk => {
    windowFilter.applyWindowFilter('HAMMING', chunk);
  });
  // Merge chunks to assemble full downsampled audio file.
  return _.flatten(chunksToWindowFilter);
};

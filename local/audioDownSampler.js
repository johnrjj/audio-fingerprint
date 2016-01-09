'use strict';
var _ = require('lodash');
var windowFilter = require('./audioWindow');
var decimator = require('./audioDecimator');
var dsp = require('./dsp');

module.exports = function(signal, origFrequency, targetFrequency) {
  if (origFrequency < targetFrequency) {
    throw 'Target frequency must be smaller than original frequency to downsample';
  } else if (origFrequency % targetFrequency != 0) {
    throw 'Frequencies must be divisible by an integer factor.';
  }
  // Create low-pass filter to get signal ready for downsampling
  // tldr: IIRFilter(filtertype, cutoff frequency, resonance, original frequency)
  let filter = new dsp.IIRFilter(dsp.LOWPASS, targetFrequency, 1, origFrequency);
  // Apply low-pass filter in place
  filter.process(signal);
  //Decimate signal to factor we want
  let decimateFactor = parseInt((origFrequency / targetFrequency));
  let decimatedSignal = decimator(signal, decimateFactor);
  // Applying hamming window to prevent spectrum leakage, in place
  windowFilter.applyWindowFilter('HAMMING', decimatedSignal);
  // Return operated-on signal
  return decimatedSignal;
};

/*eslint-disable */
'use strict';
var fft 		  = require('fft-js').fft;
var fftUtil 	  = require('fft-js').util;

module.exports = {
	convertTimeToFrequency: function(signal, sampleRate) {
		var phasors     = fft(signal);
		var frequencies = fftUtil.fftFreq(phasors, sampleRate), 
		    magnitudes  = fftUtil.fftMag(phasors); 
		var frequencyAndMagnitudeArray = frequencies.map(function (f, ix) {
		    return {frequency: f, magnitude: magnitudes[ix]};
		});
		return frequencyAndMagnitudeArray;
	}
};
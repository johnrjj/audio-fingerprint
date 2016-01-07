'use strict';

var _ 			  = require('lodash');
var util 		  = require('./audioUtil');

const timeRoundingDigit = 2;
const timePadding = 4 + timeRoundingDigit;

function computeRawTimeOffset(index) {
	return index*4096/44100; //todo: needs
};

function getTimeOffset(index) {
	return _.padLeft(computeRawTimeOffset(index).toFixed(timeRoundingDigit), timePadding);
};

module.exports = {
	hashesToHashObjectWithTimeOffset: function(hashes, offset) {
		
		let timeOffset = offset || 0;
		
		return _.map(hashes, function(hash, ix) {
							console.log(timeOffset);

			return {
				hash: hash,
				timeDelta: getTimeOffset(ix + timeOffset)
			};
		});
	}
};
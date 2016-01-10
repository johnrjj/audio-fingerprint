// stuff
'use strict';
let _ = require('lodash');
let binRanges = [
  [0, 10], //very low
  [10, 20], //low
  [20, 40], //low-mid
  [40, 80], //mid
  [80, 160], //mid-high
  [160, 511], //high
];

module.exports = function x(windows) {

}


function computeBestFitForEachBin(groupedBins) {
  let bestFitPerBin = _.map(groupedBins, function(binCollection) {
    return _.max(binCollection, function(freqMagPair) {
      // if(freqMagPair.magnitude > 10)
        return freqMagPair.magnitude;
    });
  });
  return bestFitPerBin;
};

function groupDataChunkToBins(freqMagnitudeArray, binRanges) {
  let groupedBinsData = _.map(binRanges, function(rangePair) {
    return _.filter(freqMagnitudeArray, function(freqMagnitudePair) {
      let low = rangePair[0];
      let high = rangePair[1]
      return freqMagnitudePair.frequency >= low && freqMagnitudePair.frequency < high;
    });
  });
  return groupedBinsData;
};

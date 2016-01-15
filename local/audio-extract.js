// stuff
'use strict';
let _ = require('lodash');
let mathUtil = require('./math-util');
let binRanges = [
  [0, 9], //very low
  [10, 19], //low
  [20, 39], //low-mid
  [40, 79], //mid
  [80, 159], //mid-high
  [160, 511], //high
];
let windowSize = 100;


// refactor this, it's fugly
module.exports = function x(computedWindows) {
  let groupedMaxWindows = _.map(computedWindows, (aWindow) => {
    let groupedWindow = _.groupBy(aWindow, (keyVal, index) => {
      for(var i = 0; i < binRanges.length; i++){
        let low = binRanges[i][0];
        let high = binRanges[i][1];
        if(keyVal.frequency >= low && keyVal.frequency <= high) {
            return i;
        }
      }
      throw 'this shouldnt happen...please adjust binRanges to include all freq values'
      return -1;
    });

    let groupedMaxes = _.map(groupedWindow, (group) => {
      return _.max(group, (freqMagPair) => freqMagPair.magnitude);
    });
    return groupedMaxes
  });

  let groupedWindowsAverages = _.map(groupedMaxWindows, (groupedMaxWindow) => {
    return mathUtil.average(groupedMaxWindow, 'magnitude');
  });

  let windowsMovingAverages = mathUtil.simple_moving_average(groupedWindowsAverages, windowSize);

  let filteredPoints = _.map(groupedMaxWindows, (aWindow, windowIndex) => {
    return _.filter(aWindow, (freqMagPair) => {
      return (freqMagPair.magnitude > windowsMovingAverages[windowIndex]);
    });
  });

  return filteredPoints;
};

// function computeBestFitForEachBin(groupedBins) {
//   let bestFitPerBin = _.map(groupedBins, (binCollection) => {
//     return _.max(binCollection, (freqMagPair) => {
//       // if(freqMagPair.magnitude > 10)
//         return freqMagPair.magnitude;
//     });
//   });
//   return bestFitPerBin;
// };
//
// function groupDataChunkToBins(freqMagnitudeArray, binRanges) {
//   let groupedBinsData = _.map(binRanges, (rangePair) => {
//     return _.filter(freqMagnitudeArray, (freqMagnitudePair) => {
//       let low = rangePair[0];
//       let high = rangePair[1]
//       return freqMagnitudePair.frequency >= low && freqMagnitudePair.frequency < high;
//     });
//   });
//   return groupedBinsData;
// };

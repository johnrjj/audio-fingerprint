// stuff
'use strict';
let _ = require('lodash');
let mathUtil = require('./math-util');
const movingAverageWindowSize = 100;
const stdDevCoef = 3;
const binRanges = [
  [0, 9], //very low
  [10, 19], //low
  [20, 39], //low-mid
  [40, 79], //mid
  [80, 159], //mid-high
  [160, 511], //high
];


// refactor this, it's fugly
module.exports = function x(computedWindows) {
  // Group each window into the bins above,
  let groupedWindows = _.map(computedWindows, (aWindow) => {
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
    return groupedWindow
  });

  // For each window, find the max for each bin,
  let groupedMaxWindows = _.map(groupedWindows, (groupedWindow) => {
    let groupedMaxes = _.map(groupedWindow, (group) => {
      return _.max(group, (freqMagPair) => freqMagPair.magnitude);
    });
    return groupedMaxes
  });

  // Find the average of each window, by averaging all max bins per window
  let groupedWindowsAverages = _.map(groupedMaxWindows, (groupedMaxWindow) => {
    return mathUtil.average(groupedMaxWindow, 'magnitude');
  });

  // Convert those window (magnitude) averages into moving (magnitude) averages
  let windowsMovingAverages = mathUtil.simple_moving_average(groupedWindowsAverages, movingAverageWindowSize);


  let standardDeviations = _.map(windowsMovingAverages, (avg, ix) => {
    console.log(avg);
    console.log(ix);
    return mathUtil.standardDeviation(windowsMovingAverages);
  });

  // need to make this standard deviation sliding
  // let standardDeviation = mathUtil.standardDeviation(windowsMovingAverages);
  // console.log(standardDeviation);

  // Per window, accept only the audio points that are greater than the moving average magnitude of that window
  let filteredPoints = _.map(groupedMaxWindows, (aWindow, windowIndex) => {
    return _.filter(aWindow, (freqMagPair) => {
      // console.log(standardDeviation);
      return (freqMagPair.magnitude > (windowsMovingAverages[windowIndex] + (standardDeviations[windowIndex] * stdDevCoef)));
    });
  });
  // Return a list of points that are supposedly 'features'
  // (e.g. what we think are important audio points in the audio sample)
  return filteredPoints;
};

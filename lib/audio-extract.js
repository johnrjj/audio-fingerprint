// stuff
'use strict';
var _ = require('lodash');
var mathUtil = require('./math-util');
const movingAverageWindowSize = 20;
const stdDevCoef = -.2;
const binRanges = [
  [0, 9], //very low
  [10, 19], //low
  [20, 39], //low-mid
  [40, 79], //mid
  [80, 159], //mid-high
  [160, 319],
  [320, 511], //high
];


// refactor this, it's fugly
module.exports = function(computedWindows) {
  // console.log(computedWindows);
  // console.log(computedWindows.length);

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
  // console.log(groupedWindows);

  // For each window, find the max for each bin,
  let groupedMaxWindows = _.map(groupedWindows, (groupedWindow) => {
    let groupedMaxes = _.map(groupedWindow, (group) => {
      return _.max(group, (freqMagPair) => freqMagPair.magnitude);
    });
    return groupedMaxes
  });

  // console.log(groupedMaxWindows);
  // console.log(groupedMaxWindows.length);
  let filteringData = [];
  // note this cuts off towards the end, need better algo
  for(var i = 0; i < groupedMaxWindows.length; i++) {

    let bound = Math.floor(movingAverageWindowSize/2);

    let low = i - bound;
    if(low < 0) {
      low = 0;
    }
    let high = i + bound; // slice dont care
    if (high >= groupedMaxWindows.length) {
      high = groupedMaxWindows.length - 1;
    }

    let windowRange = groupedMaxWindows.slice(low, high);

    let range = _.flatten(windowRange);
    // console.log(range);
    let rangeAvg = mathUtil.average(range, 'magnitude');
    let rangeStdDev = mathUtil.standardDeviation(_.map(range, 'magnitude'));
    // console.log(range);
    // console.log('window #' + i);
    // console.log('avg: ' + rangeAvg);
    // console.log('stdev ' + rangeStdDev);

    let temp = {
      average: rangeAvg,
      standardDeviation: rangeStdDev,
    };

    filteringData[i] = temp;
  }

  // console.log(filteringData);


  // Find the average of each window, by averaging all max bins per window
  // let groupedWindowsAverages = _.map(groupedMaxWindows, (groupedMaxWindow) => {
  //   // console.log(groupedMaxWindow);
  //   return mathUtil.average(groupedMaxWindow, 'magnitude');
  // });


  // Convert those window (magnitude) averages into moving (magnitude) averages
  // let windowsMovingAverages = mathUtil.simple_moving_average(groupedWindowsAverages, movingAverageWindowSize);


  // let standardDeviations = _.map(windowsMovingAverages, (avg, ix) => {
  //   // console.log(avg);
  //   // console.log(ix);
  //   return mathUtil.standardDeviation(windowsMovingAverages);
  // });

  // need to make this standard deviation sliding
  // let standardDeviation = mathUtil.standardDeviation(windowsMovingAverages);
  // console.log(standardDeviation);

  // Per window, accept only the audio points that are greater than the moving average magnitude of that window
  let filteredPoints = _.map(groupedMaxWindows, (aWindow, windowIndex) => {
    return _.filter(aWindow, (freqMagPair) => {
      // console.log(standardDeviation);
      return (freqMagPair.magnitude > (filteringData[windowIndex].average + (filteringData[windowIndex].standardDeviation * stdDevCoef)));
    });
  });
  // Return a list of points that are supposedly 'features'
  // (e.g. what we think are important audio points in the audio sample)
  // console.log(filteredPoints);
  // console.log(_.flatten(filteredPoints).length);

  return filteredPoints;
};

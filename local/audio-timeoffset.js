'use strict'
let _ = require('lodash');
//example: x(array, 1024, 11025, 0)
//probably a prettier way to do this

// Takes an array of audiosample windows and applies a timeoffset to the audioArray
// based on the window size, sample rate, and provided time offset
module.exports = function x(audioArray, audioWindowSize, sampleRate, timeOffset) {
  // For each window...
  return _.map(audioArray, (chosenFeaturesPerWindow, index) => {
    // Calc cur time for window
    let time = ((index * audioWindowSize / sampleRate) + timeOffset);
    // Apply time to each point in window. (immutable tho, hence clone)
    return _.map(chosenFeaturesPerWindow, (audioFeature) => {
      let temp = _.cloneDeep(audioFeature);
      temp.time = time;
      return temp;
    });
  });
}

'use strict'
let _ = require('lodash');
//example: x(array, 1024, 11025, 0)
//probably a prettier way to do this

// Takes an array of audiosample windows and applies a timeoffset to the audioArray
// based on the window size, sample rate, and provided time offset
module.exports = function x(audioWindows, audioWindowSize, sampleRate, timeOffset) {
  // For each window...
  return _.map(audioWindows, (audioWindow, index) => {
    // Calc cur time for window
    let time = ((index * audioWindowSize / sampleRate) + timeOffset);
    // Apply time to each point in window. (immutable tho, hence clone)
    return _.map(audioWindow, (audioPointInWindow) => {
      let temp = {}
      temp = _.cloneDeep(audioPointInWindow);
      temp.time = time;
      return temp;
    });
  });
}

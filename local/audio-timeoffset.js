'use strict'
let _ = require('lodash');
//example: x(array, 1024, 11025, 0)
//probably a prettier way to do this
module.exports = function x(audioArray, audioWindowSize, sampleRate, timeOffset) {
  return _.map(audioArray, (chosenFeaturesPerWindow, index) => {
    let time = ((index * audioWindowSize / sampleRate) + timeOffset);
    return _.map(chosenFeaturesPerWindow, (audioFeature) => {
      let temp = _.cloneDeep(audioFeature);
      temp.time = time;
      return temp;
    });
  });
}

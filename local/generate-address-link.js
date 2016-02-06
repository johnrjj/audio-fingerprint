'use strict'
let _ = require('lodash');

module.exports = function x(audioArr, anchorOffset, songId) {
  anchorOffset = anchorOffset || 0;
  //[“absolute time of the anchor in the song”;”Id of the song”].
  let addressLinks = _.map(audioArr, (element, index) => {
    return {
      timeOfAnchor: audioArr[anchorOffset + index].time,
      songId: songId,
    }
    // return [audioArr[anchorOffset + index].time, songId];
  });
  return addressLinks;
}

'use strict';
let _ = require('lodash');

module.exports = function generate(audioArray, anchorOffset, zoneSize) {
  // console.log(audioArray);
  // console.log(anchorOffset);
  // console.log(zoneSize);

  let allZonesAddresses = _.map(audioArray, (element, index) => {
    let anchor = index;
    let startingIndexOfZone = anchor + anchorOffset;
    let zoneAddresses = [];

    if (audioArray.length < startingIndexOfZone + zoneSize)
      return [];

    for(var i = startingIndexOfZone; i < (startingIndexOfZone + zoneSize); i++) {
      let addressArr = [];
      //[“frequency of the  anchor”;” frequency of the  point”;”delta time between the anchor and the point”].
      // addressArr.push(audioArray[anchor].frequency);
      // addressArr.push(audioArray[i].frequency);
      let deltaTime = Math.abs(audioArray[i].time - audioArray[anchor].time);
      // addressArr.push(deltaTime);
      // // console.log(addressArr);
      // zoneAddresses.push(addressArr);

      let address = {
        anchorFreq: audioArray[anchor].frequency,
        pointFreq: audioArray[i].frequency,
        timeDelta: deltaTime,
      }
      zoneAddresses.push(address);
    };
    return zoneAddresses;
  });
  // console.log(allZonesAddresses);
  return allZonesAddresses;
}


//     //[“absolute time of the anchor in the song”;”Id of the song”].
//     let addressLink = [];
//     addressLink.push(arr[anchor].time);
//     addressLink.push(songId);

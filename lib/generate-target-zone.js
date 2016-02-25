'use strict';
let _ = require('lodash');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


module.exports = function(audioArray, anchorOffset, zoneSize, songMetadata) {
  // console.log(audioArray);
  // console.log(anchorOffset);
  // console.log(zoneSize);
  let allZonesAddresses = _.map(audioArray, (element, index) => {
    let anchor = index;
    let startingIndexOfZone = anchor + anchorOffset;
    let absTimeOfAnchor = audioArray[index].time; // todo add delta time offset to function

    let zoneAddresses = [];

    if (audioArray.length < startingIndexOfZone + zoneSize)
      return [];

    for(var i = startingIndexOfZone; i < (startingIndexOfZone + zoneSize); i++) {
      let addressArr = [];
      //[“frequency of the  anchor”;” frequency of the  point”;”delta time between the anchor and the point”].
      let deltaTime = Math.abs(audioArray[i].time - audioArray[anchor].time);
      let anchorFreq = audioArray[anchor].frequency;
      let pointFreq = audioArray[i].frequency;
      let encodedAddress = pad(anchorFreq, 3) + pad(pointFreq, 3) + pad(Math.floor(deltaTime*1000), 6);

      let address = {
        anchorFreq: anchorFreq,
        pointFreq: pointFreq,
        timeDelta: deltaTime,
        encodedAddress: encodedAddress,
        absTimeOfAnchor: absTimeOfAnchor,
        songMetadata: songMetadata,
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

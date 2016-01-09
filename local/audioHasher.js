/*eslint-disable */
'use strict';
var _ = require('lodash');
var util = require('./audioUtil');
var transformer = require('./audioTransformer');

const minElementPadLengthForHash = 4; //getElementMinimumHashLength();

function computeHashesForChunks(chunks, sampleRate, binRanges) {
  let chunkSize = _.first(chunks).length;
  return _.map(chunks, (chunk) => {
    let frequencyDomainBuffer = transformer.convertTimeToFrequency(chunk, sampleRate);
    let binnedChunk = groupDataChunkToBins(frequencyDomainBuffer, binRanges);
    let selectedFeaturesForChunk = computeBestFitForEachBin(binnedChunk);
    let hashElementsForChunk = _.pluck(selectedFeaturesForChunk, 'frequency');
    let hash = createHash(hashElementsForChunk);
    return hash;
  });
};

function createHash(hashElements) {
  let normElements = util.normalizeElements(hashElements);
  let fuzzed = util.fuzzElements(normElements, 2);
  let padded = util.padElements(fuzzed, 5);
  return util.joinElements(padded);
};

// function getElementMinimumHashLength() {
// 	var nums = _.flatten(binRanges);
// 	var largest = _.max(nums);
// 	// just trust me, bro
// 	var minLengthReqForEachElement = (Math.log10((largest ^ (largest >> 31)) - (largest >> 31)) | 0) + 1;
// 	return minLengthReqForEachElement;
// };

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

function computeBestFitForEachBin(groupedBins) {
  let bestFitPerBin = _.map(groupedBins, function(binCollection) {
    return _.max(binCollection, function(freqMagPair) {
      return freqMagPair.magnitude;
    });
  });
  return bestFitPerBin;
};

class AudioHasher {
  constructor(options) {
    options = options || {}; // bad!! fix this somehow ugh....
    this.sampleRate = options.sampleRate || 44100;
    this.chunkSize = options.chunkSize || 4096;
    this.binRanges = options.binRanges || [
      [0, 39],
      [40, 79],
      [80, 119],
      [120, 179],
      [180, 500]
    ];
  }

  transform(float32AudioBuffer) {
    let bufferChunks = _.chain(float32AudioBuffer)
      .chunk(this.chunkSize)
      .dropRight()
      .value();
    let hashes = computeHashesForChunks(bufferChunks, this.sampleRate, this.binRanges);
    return hashes;
  }
}

exports.createAudioHasher = function(options) {
  return new AudioHasher(options);
}

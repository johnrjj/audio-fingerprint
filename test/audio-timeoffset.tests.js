'use strict';
var timeoffset = require('../local/audio-timeoffset');
var assert = require('chai').should();

describe('Audio Timeoffseter', function() {
  it('should offset window by zero when offset is zero', function () {
      var audioWindows = [
        [{
            frequency: 1,
            magnitude: 1,
         },
         {
            frequency: 2,
            magnitude: 2,
         },
       ]];
      var audioWindowSize = 2;
      var sampleRate = 1;
      var timeOffset = 0;
      var timeoffsetObj = timeoffset(audioWindows, audioWindowSize, sampleRate, timeOffset);
      timeoffsetObj.should.be.deep.equal(
        [
          [
            {
            frequency: 1,
            magnitude: 1,
            time: 0
          },
          {
            frequency: 2,
            magnitude: 2,
            time: 0
          },
        ]
      ]
   );
  });
  it('should offset window by 1 when offset is 1', function () {
      var audioWindows = [
        [{
            frequency: 1,
            magnitude: 1,
         },
         {
            frequency: 2,
            magnitude: 2,
         },
       ]];
      var audioWindowSize = 2;
      var sampleRate = 1;
      var timeOffset = 1;
      var timeoffsetObj = timeoffset(audioWindows, audioWindowSize, sampleRate, timeOffset);
      timeoffsetObj.should.be.deep.equal(
        [
          [
            {
            frequency: 1,
            magnitude: 1,
            time: 1
          },
          {
            frequency: 2,
            magnitude: 2,
            time: 1
          },
        ]
      ]
   );
  });
  it('should offset by window size', function () {
      var audioWindows = [
        [{}],

        [{
            frequency: 1,
            magnitude: 1,
         },
         {
            frequency: 2,
            magnitude: 2,
         },
       ]];
      var audioWindowSize = 2;
      var sampleRate = 1;
      var timeOffset = 0;
      var timeoffsetObj = timeoffset(audioWindows, audioWindowSize, sampleRate, timeOffset);
      timeoffsetObj.should.be.deep.equal(
        [
          [
            {
              time: 0
            }
          ],
          [
            {
            frequency: 1,
            magnitude: 1,
            time: 2
          },
          {
            frequency: 2,
            magnitude: 2,
            time: 2
          },
        ]
      ]
   );
  });
  it('should offset by sample rate size', function () {
      var audioWindows = [
        [{}],

        [{
            frequency: 1,
            magnitude: 1,
         },
         {
            frequency: 2,
            magnitude: 2,
         },
       ]];
      var audioWindowSize = 1;
      var sampleRate = 0.5;
      var timeOffset = 0;
      var timeoffsetObj = timeoffset(audioWindows, audioWindowSize, sampleRate, timeOffset);
      timeoffsetObj.should.be.deep.equal(
        [
          [
            {
              time: 0
            }
          ],
          [
            {
            frequency: 1,
            magnitude: 1,
            time: 2
          },
          {
            frequency: 2,
            magnitude: 2,
            time: 2
          },
        ]
      ]
   );
  });
  it('happy path', function () {
      var audioWindows = [
        [{}],

        [{
            frequency: 1,
            magnitude: 1,
         },
         {
            frequency: 2,
            magnitude: 2,
         },
         {
           frequency: 3,
           magnitude: 3,
         },
       ]];
      var audioWindowSize = 3;
      var sampleRate = 0.5;
      var timeOffset = 1;
      var timeoffsetObj = timeoffset(audioWindows, audioWindowSize, sampleRate, timeOffset);
      timeoffsetObj.should.be.deep.equal(
        [
          [
            {
              time: 1
            }
          ],
          [
            {
            frequency: 1,
            magnitude: 1,
            time: 7
          },
          {
            frequency: 2,
            magnitude: 2,
            time: 7
          },
          {
            frequency: 3,
            magnitude: 3,
            time: 7,
          }
        ]
      ]
   );
  });
});

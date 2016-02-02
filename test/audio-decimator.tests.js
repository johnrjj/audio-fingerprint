'use strict';
var decimator = require('../local/audio-decimator');
var assert = require('chai').should();

describe('Audio Decimator', function() {
  it('should decimate to no elements when decimate factor is 0', function () {
      const signal = [1,2,3,4,5,6,7,8,9,10];
      const decimateFactor = 0;
      var decimatedSignal = decimator(signal, decimateFactor);
      decimatedSignal.should.be.deep.equal([]);
  });
  it('should retain every element when decimate factor is 1', function () {
      const signal = [1,2,3,4,5,6,7,8,9,10];
      const decimateFactor = 1;
      var decimatedSignal = decimator(signal, decimateFactor);
      decimatedSignal.should.be.deep.equal([1,2,3,4,5,6,7,8,9,10]);
  });
  it('should filter out every other element when decimate factor is 2', function () {
      const signal = [1,2,3,4,5,6,7,8,9,10];
      const decimateFactor = 2;
      var decimatedSignal = decimator(signal, decimateFactor);
      decimatedSignal.should.be.deep.equal([1,3,5,7,9]);
  });
  it('should decimate down to one element when decimate factor is equal to array size', function () {
      const signal = [1,2,3,4,5,6,7,8,9,10];
      const decimateFactor = 10;
      var decimatedSignal = decimator(signal, decimateFactor);
      decimatedSignal.should.be.deep.equal([1]);
  });
  it('should decimate down to one element when decimate factor is greater to array size', function () {
      const signal = [1,2,3,4,5,6,7,8,9,10];
      const decimateFactor = 11;
      var decimatedSignal = decimator(signal, decimateFactor);
      decimatedSignal.should.be.deep.equal([1]);
  });
});

// Takes a signal window and applies (currently only) a hamming window filter
'use strict';
let _ = require('lodash');

module.exports = {
  computeWindowFilterCoefForIndex: function(windowLength, index) {
    if(windowLength == 1) {
      return 1;
    }
    return 0.54 - 0.46 * Math.cos(2 * Math.PI * index / (windowLength - 1));
  },
  applyWindowFilter: function(filterType, source) {
    switch (filterType) {
      default:
        let windowLength = source.length;
        _.forEach(source, (element, index) => {
          element *= this.computeWindowFilterCoefForIndex(windowLength, index);
        });
    }
  }
};

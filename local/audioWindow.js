'use strict';
var _ = require('lodash');

module.exports = {
  computeWindowFilterCoefForIndex: function(length, index) {
    return 0.54 - 0.46 * Math.cos(2 * Math.PI * index / (length - 1));
  },
  applyWindowFilter: function(filter, source) {
    let length = source.length;
    _.forEach(source, (element, index) => {
      element *= this.computeWindowFilterCoefForIndex(length, index);
    });
  }
};

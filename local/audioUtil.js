/*eslint-disable */
'use strict'
var _ = require('lodash');

module.exports = {
  joinElements: function(elements) {
    return elements.join('');
  },
  padElements: function(elements, padLength) {
    return _.map(elements, function(element) {
      return _.padLeft(element, padLength, '0')
    });
  },
  normalizeElements: function(elements) {
    return _.map(elements, Math.floor);
  },
  fuzzElements: function(elements, fuzzFactor) {
    return _.map(elements, function(element) {
      return (element - (element % fuzzFactor));
    });
  }
};

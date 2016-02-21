//Downsamples the filtered signal by M (factor); that is, keep only every Mth sample.
'use strict';
let _ = require('lodash');

module.exports = function(signal, factor) {
  return _.filter(signal, (item, index) => {
    return (index % factor == 0);
  });
};

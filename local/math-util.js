'use strict';
let _ = require('lodash');

module.exports = {
  simple_moving_average: function(arr, size, calcAllSizeWindows) {
    calcAllSizeWindows = calcAllSizeWindows || true;
    let win, i, newarr = [];
    for(i = 0; i < arr.length; i++) {
      win = arr.slice(i - size, i);
      // todo need to refactor this whole function
      if(i < size) {
        win = arr.slice(0, i+1); //hack
      }
      if (calcAllSizeWindows || win.length === size) {
        newarr.push(this.average(win));
      }
    }
    return newarr;
  },
  average: function(obj, key) {
    return this.sum(obj, key) / _.size(obj);
  },
  sum: function(obj, key) {
    let arr;
    if (_.isArray(obj) && typeof obj[0] === 'number') {
      arr = obj;
    } else {
      key = key || 'value';
      arr = _.pluck(obj, key);
    }
    let val = 0, i;
    for (i = 0; i < arr.length; i++)
      val += (arr[i]-0);
    return val;
  }
};

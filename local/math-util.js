'use strict';
let _ = require('lodash');

function standardDeviation(values){
  var avg = mean(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = mean(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function mean(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

module.exports = {
  standardDeviation: standardDeviation,

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
      arr = _.map(obj, key);
    }
    let val = 0, i;
    for (i = 0; i < arr.length; i++)
      val += (arr[i]-0);
    return val;
  }
};

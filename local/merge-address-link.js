'use strict';
let _ = require('lodash');

module.exports = function merge(addresses, addressLinks) {
  if(addresses.length != addressLinks.length) {
    throw 'should be an equal number of addresses to address lengths';
  }
  let test = _.map(addresses, (address, idx) => {
    return {
      address: address,
      addressLink: addressLinks[idx],
    };
  });

  console.log(test);
  return test;
  // throw e;
}

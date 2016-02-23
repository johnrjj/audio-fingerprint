
var _ = require('lodash');
var fingerprint = require('../../lib/audio-fingerprint');
// var test = require('../../lib/audio-fingerprint');
onmessage = function(e) {
	// console.log('here!!!');
	// throw 'hello';
	let floats = new Float32Array(e.data.buffer);
	// console.log('in worker');
	// console.log(floats.length);
	// console.log(floats);
	// console.log(floats);
	// fingerprint();
	var res = fingerprint(floats, 44100, 11025, null);
	// console.log(res);
	postMessage(res);
	close();
}

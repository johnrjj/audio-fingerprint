
var _ = require('lodash');
var fingerprint = require('../../local/audio-test');
var test = require('../../local/audio-fingerprint');
onmessage = function(e) {
	// console.log('here!!!');
	// throw 'hello';
	// let floats = new Float32Array(e.data.buffer);
	console.log('in worker');
	// console.log(floats);
	// console.log(floats);
	fingerprint();
	// var res = fingerprint(floats, 44100, 11025);
	// console.log(res);
	postMessage('');
	close();
}

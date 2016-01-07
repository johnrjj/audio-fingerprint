// import AudioHasher from '../local/audioHasher';
import AudioHasher  from '../local/audioHasher';;
import _ from 'lodash';

onmessage = function(e) {
	let floats = new Float32Array(e.data.buffer);
	let hasher = AudioHasher.createAudioHasher({
		'sampleRate': e.data.sampleRate,
	});
	let res = hasher.transform(floats);
	console.log(res);
	postMessage(res);
	close();
}

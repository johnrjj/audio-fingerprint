// var BinaryServer = require('binaryjs').BinaryServer;
// var fs = require('fs');

// var server = BinaryServer({port: 9000});

// server.on('connection', function(client){
//     console.log('Connection');
//     client.on('stream', function(stream){
//         var file; //Moved this so it's accessible to the 'end' handler
//         stream.on('data', function(data) {
//             file = fs.createReadStream(data['path']);
//             client.send(file, {'target':data['target']});
//         });

//         stream.on('end', function(){
//             if (file) file.destroy.bind(file); //Releases the handle and allows garbage collection
//         });

//         client.on('close', function(){
//             if (file) file.destroy.bind(file); //Releases the handle and allows garbage collection
//         });

//     });
// });
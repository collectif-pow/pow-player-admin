const client = require('dgram').createSocket('udp4');
const msg = process.argv[2];
client.send(msg, 0, msg.length, 8888, '192.168.43.118', () => {
	client.send(msg, 0, msg.length, 8888, '127.0.0.1', process.exit);
});

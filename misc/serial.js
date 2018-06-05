const SerialPort = require('serialport');
const port = new SerialPort('/dev/cu.usbserial', {
	baudRate: 9600,
});

port.on('open', () => {
	console.log('open');
	port.write('* 0 IR 002\r', err => {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		console.log('message written');
	});
});

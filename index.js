const express = require('express');
const formidable = require('formidable');
const cors = require('cors');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const uuidv1 = require('uuid/v1');
const client = require('dgram').createSocket('udp4');
const ping = require('net-ping');
const schedule = require('node-schedule');

// UDP messaging to the players
const send = async (ip, msg) => {
	return new Promise((resolve, reject) => {
		client.send(msg, 0, msg.length, 8888, ip, err => {
			if (err) reject(err);
			else resolve();
		});
	});
};

// ping
const session = ping.createSession();
const scan = ip => {
	return new Promise((resolve, reject) => {
		session.pingHost(ip, (err, target) => {
			if (err) resolve(target);
			else resolve();
		});
	});
};

// Create server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Create database instance and start server
const adapter = new FileAsync(__dirname + '/db.json');
low(adapter)
	.then(db => {
		// cron stuff
		let s;
		let e;
		const cron = db.get('cron').value();
		const initCron = cron => {
			if (cron.startH && cron.endH) {
				if (s && s.cancel) s.cancel();
				if (e && e.cancel) e.cancel();
				s = schedule.scheduleJob(
					`${parseInt(cron.startM, 10)} ${parseInt(cron.startH, 10)} * * *`,
					() => {
						console.log('Starting');
						const players = db.get('players').value();
						const promises = [];
						players.forEach(player => {
							if (player.rs232) promises.push(send(player.ip, 'on'));
							promises.push(send(player.ip, 'loop'));
						});
						Promise.all(promises)
							.then(() => res.send({ success: true }))
							.catch(e => console.log);
					}
				);
				e = schedule.scheduleJob(
					`${parseInt(cron.endM, 10)} ${parseInt(cron.endH, 10)} * * *`,
					() => {
						console.log('Stopping');
						const players = db.get('players').value();
						const promises = [];
						players.forEach(player => {
							if (player.rs232) promises.push(send(player.ip, 'off'));
							promises.push(send(player.ip, 'stop'));
						});
						Promise.all(promises)
							.then(() => res.send({ success: true }))
							.catch(e => console.log);
					}
				);
			}
		};
		initCron(cron);
		// Routes
		// GET /api/player
		app.get('/api/player', (req, res) => {
			const players = db.get('players').value();
			res.send(players);
		});
		// GET /api/player/:id
		app.get('/api/player/:id', (req, res) => {
			const player = db
				.get('players')
				.find({ id: req.params.id })
				.value();
			res.send(player);
		});
		// DELETE /api/player/:id
		app.delete('/api/player/:id', (req, res) => {
			const player = db
				.get('players')
				.remove({ id: req.params.id })
				.write();
			res.send({ success: true });
		});
		// POST /api/player
		app.post('/api/player', (req, res) => {
			const form = new formidable.IncomingForm();
			form.parse(req, (err, fields, files) => {
				if (err) res.status(500).send(err);
				else {
					db.get('players')
						.push(fields)
						.last()
						.assign({ id: uuidv1() })
						.write()
						.then(post => res.send(post));
				}
			});
		});

		// GET /api/play
		app.get('/api/play', (req, res) => {
			const ips = db
				.get('players')
				.value()
				.map(p => p.ip);
			const promises = [];
			ips.forEach(ip => {
				promises.push(send(ip, 'loop'));
			});
			Promise.all(promises)
				.then(() => res.send({ success: true }))
				.catch(e => res.send({ success: false, error: e }));
		});

		// GET /api/stop
		app.get('/api/stop', (req, res) => {
			const ips = db
				.get('players')
				.value()
				.map(p => p.ip);
			const promises = [];
			ips.forEach(ip => {
				promises.push(send(ip, 'stop'));
			});
			Promise.all(promises)
				.then(() => res.send({ success: true }))
				.catch(e => res.send({ success: false, error: e }));
		});

		// GET /api/on
		app.get('/api/on', (req, res) => {
			const ips = db
				.get('players')
				.filter({ rs232: 'true' })
				.value()
				.map(p => p.ip);
			console.log(ips);
			const promises = [];
			ips.forEach(ip => {
				promises.push(send(ip, 'on'));
			});
			Promise.all(promises)
				.then(() => res.send({ success: true }))
				.catch(e => res.send({ success: false, error: e }));
		});

		// GET /api/off
		app.get('/api/off', (req, res) => {
			const ips = db
				.get('players')
				.value()
				.map(p => p.ip);
			const promises = [];
			ips.forEach(ip => {
				promises.push(send(ip, 'off'));
			});
			Promise.all(promises)
				.then(() => res.send({ success: true }))
				.catch(e => res.send({ success: false, error: e }));
		});

		// GET /api/scan
		app.get('/api/scan', (req, res) => {
			const ips = db
				.get('players')
				.value()
				.map(p => p.ip);
			const promises = ips.map(ip => scan(ip));
			Promise.all(promises)
				.then(r => {
					if (r) res.send({ success: false, error: r });
					res.send({ success: true });
				})
				.catch(e => res.send({ success: false, error: 'Unknown error' }));
		});

		// POST /api/cron
		app.post('/api/cron', (req, res) => {
			const form = new formidable.IncomingForm();
			form.parse(req, (err, fields, files) => {
				if (err) res.status(500).send(err);
				else {
					db.set('cron', fields)
						.write()
						.then((data, err) => {
							initCron(data.cron);
							return res.send({
								success: err ? false : true,
								error: err,
							});
						});
				}
			});
		});
		// GET /api/cron
		app.get('/api/cron', (req, res) => {
			const cron = db.get('cron').value();
			res.send(cron);
		});

		// Set db default values
		return db.defaults({ players: [], cron: {} }).write();
	})
	.then(() => {
		app.listen(3000, () => console.log('listening on port 3000'));
	});

const port = 31313;
const port2 = 21212;

const handler = (req, res) => {
	let proxy = require('../index')({
		target: `http://localhost:${port2}`
	});
	proxy(req, res);
};

let ser1, ser2;


describe('Proxy', () => {

	beforeEach((done) => {
		ser1 = require('http').createServer(handler).listen(port, (err) => {
			if (err) {
				done(err);
			} else {
				ser2 = require('http').createServer((req, res) => {
					//console.log(req.url);
					let e = req.url.split('/').pop();
					if((e.length > 0 && String((e * 1)) === e)) {
						res.statusCode = e;
					}
					res.write('ok');
					res.end()
				}).listen(port2, (err) => {
					if (err) return done(err);

					done();
				})
			}
		});
	});


	afterEach(() => {
		if (ser1) ser1.close();
		if (ser2) ser2.close();
	});

	it('Match', (done) => {
		require('request')(`http://localhost:${port}`, (err, res, body) => {
			if (res.statusCode === 200 && body === 'ok') {
				done();
			} else {
				done('Wrong Error code');
			}
		});
	});
	it('Mismatch', (done) => {
		require('request')(`http://localhost:${port}/500`, (err, res, body) => {
			//console.log(err, res, body);
			if (res.statusCode === 500 && body === 'ok') {
				done();
			} else {
				done('Wrong Error code');
			}
		});
	});
});
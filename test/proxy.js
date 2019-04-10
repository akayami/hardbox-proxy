const port = 31313;
const port2 = 21212;

const proxyHandler = (req, res) => {
	let proxy = require('../index')({
		target: `http://localhost:${port2}`
	});
	proxy(req, res);
};

let proxyServer, ser2;


describe('Proxy', () => {

	beforeEach((done) => {
		proxyServer = require('http').createServer(proxyHandler).listen(port, (err) => {
			if (err) {
				done(err);
			} else {
				ser2 = require('http').createServer((req, res) => {
					let e = req.url.split('/').pop();
					if((e.length > 0 && String((e * 1)) === e)) {
						res.statusCode = e;
					}
					res.setHeader('originHeader', 'originHeaderValue');
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
		if (proxyServer) proxyServer.close();
		if (ser2) ser2.close();
	});

	it('Match', (done) => {
		require('request')({url: `http://localhost:${port}`, headers: {
				'requestHeader': 'requestHeaderValue'
			}}, (err, res, body) => {
			if (res.statusCode === 200 && body === 'ok') {
				console.log(res.headers)
				done();
			} else {
				done('Wrong Error code');
			}
		});
	});
	it('Trigger Error', (done) => {
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
const { should, expect } = require('chai');

const { Console } = require('console');
const level = require('@akayami/console-level');
console = new Console({ stdout: process.stdout, stderr: process.stderr });
// Make console output only warns and bellow
console = level(console, 'log');

//console.log(expect);

const port = 31313;
const port2 = 21212;

const proxyHandler = (req, res) => {
	const proxy = require('../index')(require('express')(),{
		target: `http://localhost:${port2}`
	});
	proxy(req, res, (e) => {
		//console.error(e);
	});
};

let proxyServer, ser2;


describe('Proxy', () => {

	beforeEach((done) => {
		proxyServer = require('http').createServer(proxyHandler).listen(port, (err) => {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});


	afterEach(() => {
		if (proxyServer) proxyServer.close();
	});

	describe('Basic Tests', ()=> {

		beforeEach((done) => {
			ser2 = require('http').createServer((req, res) => {
				const e = req.url.split('/').pop();
				if((e.length > 0 && String((e * 1)) === e)) {
					res.statusCode = e;
				}
				//console.log(req.headers);
				res.setHeader('originHeader', 'originHeaderValue');
				res.write('ok');
				res.end();
			}).listen(port2, (err) => {
				if (err) return done(err);

				done();
			});
		});

		afterEach((done) => {
			if (ser2) ser2.close();
			done();
		});

		it('Match', (done) => {
			require('request')({url: `http://localhost:${port}`, headers: {
				'requestHeader': 'requestHeaderValue'
			}}, (err, res, body) => {
				if (res.statusCode === 200 && body === 'ok') {
					//console.log(res.headers);
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

	it('Passes Headers Correctly', done => {

		let serv;

		afterEach(done => {
			if (serv) serv.close();
			done();
		});

		serv = require('http').createServer((req, res) => {
			const e = req.url.split('/').pop();
			if((e.length > 0 && String((e * 1)) === e)) {
				res.statusCode = e;
			}
			res.setHeader('originHeader', 'originHeaderValue');
			res.write('ok');
			res.end();
			//expect(req).to.be.an('object');
			//console.log(req.headers);
			expect({requestHeader: 'test'}).to.have.property('requestHeader');
			expect(req.headers).to.have.property('requestheader');
			expect(req.headers['requestheader']).to.equal('requestHeaderValue');
			done();
		}).listen(port2, (err) => {
			if (err) return done(err);
			require('request')({url: `http://localhost:${port}`, headers: {
				'requestHeader': 'requestHeaderValue'
			}}, (err, res, body) => {
				// if (res.statusCode === 200 && body === 'ok') {
				// 	//console.log(res.headers);
				// 	done();
				// } else {
				// 	done('Wrong Error code');
				// }
			});
		});
	});


	it('Fails correctly when no backend is available', done => {
		require('request')({url: `http://localhost:${port}`, headers: {
			'requestHeader': 'requestHeaderValue'
		}}, (err, res, body) => {
			if (res.statusCode === 503) {
				//console.log(res.headers);
				done();
			} else {
				done('Wrong Error code');
			}
		});
	});
});
const { should, expect } = require('chai');

const { Console } = require('console');
const level = require('@akayami/console-level');
console = new Console({ stdout: process.stdout, stderr: process.stderr });
// Make console output only warns and bellow
console = level(console, 'log');

//console.log(expect);

const port = 31313;
const port2 = 21212;

let proxyServer, ser2;


describe('Test Proxy Injectable Error Handler', () => {

	it('must call injectable error handler', done => {

		const proxyHandler = (req, res) => {
			const proxy = require('../index')(require('express')(),{
				proxy: {
					target: `http://localhost:${port2}`
				}
			});
			proxy(req, res, (e) => {
				expect(e).to.be.an('Error');
				done();
			});
		};


		proxyServer = require('http').createServer(proxyHandler).listen(port, (err) => {
			if (err) {
				done(err);
			} else {
				require('request')({url: `http://localhost:${port}`}, (err, res, body) => {
					if(err) console.error(err);
				});
			}
		});
	});

	after(() => {
		if (proxyServer) proxyServer.close();
	});
});
const { should, expect } = require('chai');

const { Console } = require('console');
const level = require('@akayami/console-level');
console = new Console({ stdout: process.stdout, stderr: process.stderr });
// Make console output only warns and bellow
console = level(console, 'log');

//console.log(expect);

const port = 31313;
const port2 = 21212;

let proxyServer, ser2, app;


describe('Test Proxy Injectable Error Handler', () => {

	it('must call injectable error handler', done => {
		
		app = require('express')();
		
		const proxyHandler = (req, res) => {
			const proxy = require('../index')(app,{
				proxy: {
					target: `http://localhost:${port2}`
				}
			});
			app(req, res);
		};


		proxyServer = require('http').createServer(proxyHandler).listen(port, (err) => {
			if (err) {
				done(err);
			} else {
				require('request')({url: `http://localhost:${port}`}, (err, res, body) => {
					expect(res.statusCode).to.be.equal(503);
					done();
				});
			}
		});
	});

	after(() => {
		if (proxyServer) proxyServer.close();
	});
});
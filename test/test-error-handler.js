const { should, expect } = require('chai');

//console.log(expect);

const port = 31313;
const port2 = 21212;

let proxyServer, ser2;


describe('Test Proxy Injectable Error Handler', () => {

	it("must call injectable error handler", done => {

		let proxyHandler = (req, res) => {
			let proxy = require('../index')({
				target: `http://localhost:${port2}`
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

				});
			}
		});
	});

	after(() => {
		if (proxyServer) proxyServer.close();
	})
});
const hardbox = require('hardbox');
const request = require('request');
const {expect} = require('chai');
const config = {};

const { Console } = require('console');
const level = require('@akayami/console-level');
console = new Console({ stdout: process.stdout, stderr: process.stderr });
// Make console output only warns and bellow
console = level(console, 'info');

config.morgan = 'tiny'; // tiny/combined etc.

config.workers = 1;

const port = 2100;

// Sets up app output library (stdout and such)
config.bunyan = {
	name: 'hardbox',
	streams: [{
		level: 'info',	//debug, info, error
		stream: process.stdout
	},]
};

config.controller = {
	endpoint: [{
		server: require('http'),
		listen: {
			path: '/run/hardbox.sock'
		}
	}],
	vhost: {
		list: [require('./vhost/test2.vhost')]
		
		//path: __dirname + '/vhost/'
	}
};


config.node = {
	global_path: '/usr/lib/node_modules'
};

let i;
let target;


describe('Testing server', () => {
	beforeEach(() => {
		i = hardbox(config);
		const app = require('express')();
		app.get('/', (req, res) => {
			res.send('Hello World!');
			console.debug('Sending Response');
		});
		target = app.listen(
			port,
			(s) => {
				console.log(`Example app listening on port ${port}!`);
			}
		);
	});
	afterEach((done) => {
		i.close();
		target.close();
		done();
	});
	
	it('Needs to start and stop', (done) => {
		done();
	});
	
	it('Needs to proxy', (done) => {
		request('http://localhost:2199', (err, res, body) => {
			if(err) return done(err);
			expect(res.statusCode).equal(200);
			expect(body).equal('Hello World!');
			done();
		});
	});
	
	it('Needs to 404 on invalid path', (done) => {
		request('http://localhost:2199/test', (err, res, body) => {
			if(err) return done(err);
			expect(res.statusCode).equal(404);
			done();
		});
	});
});

const server = require('hardbox');
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
		list: [
			{
				name: 'test',
				vhost: {
					protocol: 'http',
					domain: 'localhost',
					port: '2199',
					pathname: '/'
				},
				morgan: {
					format: 'tiny',
					options: {}
				},
				modules: [
					{
						name:  __dirname + '../../index',
						config: {
							proxy: {
								target: 'http://localhost:' + port
							}
						}
					}
				]
			}
		]
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
		i = server(config);
	});
	afterEach((done) => {
		i.close();
		done();
	});
	
	it('Needs to start and stop', (done) => {
		done();
	});
	
	it('Needs to fail when no backend available', (done) => {
		request('http://localhost:2199', (err, res, body) => {
			if(err) return done(err);
			expect(res.statusCode).equal(503);
			done();
		});
	});
});

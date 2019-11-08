module.exports = {
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
			name: __dirname + '../../../index',
			config: {
				target: 'http://localhost:2100'
			}
		}
	]
};
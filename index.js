module.exports = (app, config) => {

	const httpProxy = require('http-proxy');
	const proxy = httpProxy.createProxyServer({
		xfwd: true
	});
	
	console.debug('Setting up forwarding to', config.target);
	
	return (req, res, errorHandler) => {

		proxy.on('proxyReq', function (proxyReq, req, res, options) {
			// Forward Proxy Request

			// This might not be useful

			// if (res.proxyHeaders) {
			// 	for (var x = 0; x < res.proxyHeaders.length; x++) {
			// 		proxyReq.setHeader(res.proxyHeaders[x][0], res.proxyHeaders[x][1]);
			// 	}
			// }
			proxyReq.setHeader('x-powered-by', 'Hardbox Reverse Proxy');
		});
		console.debug('Attempting to proxy to:', config.target);
		proxy.web(req, res, {
			target: config.target
		}, function (e) {
			res.statusCode = 503;
			res.end();
			if(errorHandler) errorHandler(e);
		});
	};
};
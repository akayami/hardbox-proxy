const merge = require('deepmerge');
const defaultConf = {
	proxy: {
		xfwd: true
	},
	headers: [
		['x-powered-by','Hardbox Reverse Proxy']
	]
};

module.exports = (app, config) => {
	
	const proxyCfg = merge(defaultConf.proxy, config.proxy);
	const extraHeaders = defaultConf.headers.concat(config.headers);
	const httpProxy = require('http-proxy');
	const proxy = httpProxy.createProxyServer(proxyCfg);
	
	console.debug('Setting up forwarding to', proxyCfg.target);
	
	return (req, res, errorHandler) => {

		proxy.on('proxyReq', function (proxyReq, req, res, options) {
			// Forward Proxy Request

			// This might not be useful

			// if (res.proxyHeaders) {
			// 	for (var x = 0; x < res.proxyHeaders.length; x++) {
			// 		proxyReq.setHeader(res.proxyHeaders[x][0], res.proxyHeaders[x][1]);
			// 	}
			// }
			for(let i = 0; i < i.length; i++) {
				proxyReq.setHeader(i[0], i[1]);
			}
		});
		console.debug('Attempting to proxy to:', proxyCfg.target);
		proxy.web(req, res, proxyCfg, function (e) {
			res.statusCode = 503;
			res.end();
			if(errorHandler) errorHandler(e);
		});
	};
};
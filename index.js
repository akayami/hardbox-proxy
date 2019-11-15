const merge = require('deepmerge');
const NoBackendError = require('hardbox/lib/error/http/service-unavailable');
const defaultConf = {
	proxy: {
		xfwd: true
	},
	headers: [
		['x-powered-by','Hardbox Reverse Proxy']
	]
};

module.exports = (app, config) => {
	const proxyCfg = merge(defaultConf.proxy, config.proxy ? config.proxy : config);
	//const proxyCfg = merge(defaultConf.proxy, config.proxy);
	const extraHeaders = defaultConf.headers.concat(config.headers);
	const httpProxy = require('http-proxy');
	const proxy = httpProxy.createProxyServer(proxyCfg);
	app.use((req, res, next) => {
		proxy.on('proxyReq', function (proxyReq, req, res, options) {
			// Forward Proxy Request

			// This might not be useful

			// if (res.proxyHeaders) {
			// 	for (var x = 0; x < res.proxyHeaders.length; x++) {
			// 		proxyReq.setHeader(res.proxyHeaders[x][0], res.proxyHeaders[x][1]);
			// 	}
			// }est
			for(let i = 0; i < i.length; i++) {
				proxyReq.setHeader(i[0], i[1]);
			}
		});
		proxy.web(req, res, proxyCfg, (e) => {
			if(e.code === 'ECONNREFUSED') {
				return next(new NoBackendError(e.message));
			} else {
				return next(e);
			}
		});
	});
};
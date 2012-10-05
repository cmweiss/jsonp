// server.js

var url = require('url'),
    http = require('http'),
    port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    'use strict';
	console.log('Path: ' + url.parse(req.url).path);
	if (url.parse(req.url).pathname.toLowerCase() != '/jsonp') {
		res.writeHead(404);
		res.end();
	} else {
		res.writeHead(200, {'Content-Type': 'application/javascript'});
		var options = url.parse(decodeURI(url.parse(req.url, true).query.url)); // parse url query string


		res.write(decodeURI(url.parse(req.url, true).query.callback) + '(' + JSON.stringify(options) + ','); // callback

		http.get(options, function (getres) { //{host: options.host, path: options.path}
			res.write('"' + getres.statusCode + '",' + JSON.stringify(getres.headers) + ',"');
			getres.setEncoding('utf8');
			getres.on('data', function (chunk) {
				res.write(encodeURI(chunk));
			});
			getres.on('end', function () {
				res.end('");');
			});
		}).on('error', function (e) {
			console.log("Error in http.get: " + e.message);
		});
	}

}).listen(port);
console.log('Server running on port ' + port + '.');

var debug = require('debug')('lg-tv-api:request-manager');
var _ = require('underscore');
var http = require("http");

function httpOptions(hostname, port, path, method) {
    return {
        host: hostname,
        port: port,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'User-Agent': 'UDAP/2.0'
        }
    };
}

function sendHttpRequest(options, body, callback) {
    debug('HTTP request with options :\n%s', options);

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');

        var responseContent = '';
        res.on('data', function (chunk) {
            responseContent += chunk;
        });

        res.on('end', function() {
            res.body = responseContent;
            debug('==========RESPONSE==============\nStatus: %s\nBody: \n%s', res.statusCode, res.body);
            callback(null, res);
        });
    });

    req.on('error', function(e) {
        debug('==========ERROR==============\nProblem with request: %s', e.message);
        callback(e);
    });

    if (!_.isEmpty(body)) {
        req.write(body);
    }

    req.end();
}

// Public functions
exports = module.exports = {};
exports.options = httpOptions;
exports.send = sendHttpRequest;
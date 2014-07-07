var debug = require('debug')('lg-tv-api:utils');
var _ = require('underscore');
var http = require("http");
var libxmljs = require("libxmljs");

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

function buildApiXml(apiType, apiName, param, port) {
    var doc = new libxmljs.Document();

    var apiElement = doc.node('envelope')
        .node('api').attr('type', apiType);

    if (!_.isEmpty(apiName)) {
        apiElement.node('name', apiName);
    }
    if (!_.isEmpty(param)) {
        apiElement.node('value', String(param)); // Value needs to be a String
    }
    if (!_.isEmpty(port)) {
        apiElement.node('port', String(port));
    }

    debug('Api XML \n%s', doc.toString());

    return doc;
}

// Public functions
module.exports.requestOptions = httpOptions;
module.exports.sendRequest = sendHttpRequest;
module.exports.xmlContent = buildApiXml;
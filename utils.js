var _ = require('underscore');
var http = require("http");
var libxmljs = require("libxmljs");

function httpOptions(hostname, port, method) {
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
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');

        var responseContent = '';
        res.on('data', function (chunk) {
            responseContent += chunk;
        });

        res.on('end', function() {
            res.body = responseContent;
            console.log('\n\n==========RESPONSE==============');
            console.log('Status:', res.statusCode);
            console.log('Body:');
            console.log(res.body);
            callback(null, res);
        });
    });

    req.on('error', function(e) {
        console.log('\n\n==========ERROR==============');
        console.log('problem with request: ' + e.message);
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

    console.log('XML : ', doc.toString());

    return doc;
}

// Public functions
module.exports.requestOptions = httpOptions;
module.exports.sendRequest = sendHttpRequest;
module.exports.xmlContent = buildApiXml;
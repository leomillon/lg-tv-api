var debug = require('debug')('lg-tv-api:content');
var _ = require('underscore');
var libxmljs = require("libxmljs");

function buildXml(apiType, apiName, param, port) {
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
module.exports.xml = buildXml;
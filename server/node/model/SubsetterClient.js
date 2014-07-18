var thrift = require('thrift');
var SubsetterService = require('../../thrift/gen-nodejs/SubsetterService');
var types = require('../../thrift/gen-nodejs/subsetter_types');

var transport = thrift.TBufferedTransport();
var protocol = thrift.TBinaryProtocol();

// the port is currently set fixed the same as java side
function getInstance(errHandler) {

    var connection = thrift.createConnection("localhost", 10090, {
        transport: transport,
        protocol: protocol
    });

    connection.on('error', errHandler);

    var client = thrift.createClient(SubsetterService, connection);
    client.end = function () {
        connection.end();
    };

    return client;
}

module.exports = {
    "getInstance": getInstance
}
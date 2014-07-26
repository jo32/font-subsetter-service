var thrift = require('thrift');
var SubsetterService = require('../../thrift/gen-nodejs/SubsetterService');
var types = require('../../thrift/gen-nodejs/subsetter_types');

var transport = thrift.TBufferedTransport();
var protocol = thrift.TBinaryProtocol();

var liveConnections = 0;

function getInstance(callback) {

    if (liveConnections >= 10) {
        var err = new Error("Too much connections.");
        return callback(err);
    }

    var connection = thrift.createConnection("localhost", 10090, {
        transport: transport,
        protocol: protocol
    });

    /**
     * WARNING: timeout is not handled, should add event mechanism later.
     */

    connection.on('timeout', function (err) {
        return callback(err);
    });

    connection.on('error', function (err) {
        return callback(err);
    });

    connection.on('connect', function () {
        var client = thrift.createClient(SubsetterService, connection);
        client.end = function () {
            liveConnections -= 1;
            connection.end();
        }
        liveConnections += 1;
        return callback(null, client);
    });
}

module.exports = {
    "getInstance": getInstance
}

console.log(__filename + ": " + "Loaded module: " + __filename);
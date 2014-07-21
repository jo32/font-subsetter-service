var thrift = require('thrift');
var SubsetterService = require('../../thrift/gen-nodejs/SubsetterService');
var types = require('../../thrift/gen-nodejs/subsetter_types');

var transport = thrift.TBufferedTransport();
var protocol = thrift.TBinaryProtocol();


function SubsetterClient() {

    this.connection = thrift.createConnection("localhost", 10090, {
        transport: transport,
        protocol: protocol
    });

    this.getClient = function () {

        var client = thrift.createClient(SubsetterService, connection);

        client.end = function () {
            this.connection.end();
        };

        return client;
    }

    this.end = function () {
        this.connection.end();
    }

}

module.exports = SubsetterClient;
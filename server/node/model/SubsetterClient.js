var thrift = require('thrift');
var SubsetterService = require('../../thrift/gen-nodejs/SubsetterService');
var types = require('../../thrift/gen-nodejs/subsetter_types');

var transport = new thrift.TBufferedTransport();
var protocal = new thrift.TBinaryProtocol();

var connection = thrift.createConnection("localhost")
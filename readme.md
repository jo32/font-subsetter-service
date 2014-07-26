# FONT-SUBSETTER WEB SERVICE

## Intro

A web service that help you generate a subset the a font used to embed on your website.


## Runtime

1. java 7
2. node


## Dependencies

1. sfntly: https://code.google.com/p/sfntly/
2. Express: http://expressjs.com/
3. Thrift: http://thrift.apache.org/
4. Maven 3


## Installation Guide

1. run `./init.sh`


## Running Guide

1. run `./run-java.sh`
2. run `./run-node.sh`

## TODO

1. error handling uploading non font file
2. <strike>moving all the $http invokation into a service</strike>
3. <strike>bug of hash mismatch</strike>
4. <strike>java service: out of memory, possibly not releasing the file opened - TBD</strike>
5. java service: out of memory, possibly too many threads.
6. uploading msyhl.ttc
7. subsettting adobe fan heiti std b
8. handling connection timeout
9. moving java service config into config.json
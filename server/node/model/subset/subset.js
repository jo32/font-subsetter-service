var config = require("../../../config.json");
var path = require("path");
var fs = require("fs");
var SubsetterClient = require('../SubsetterClient');
var FileType = require('../../../thrift/gen-nodejs/subsetter_types').FileType;
var async = require('async');

// get the path of dir storing the font files
var fontFolder = path.resolve(
    path.join(__dirname, "../../.."), config["font-folder"]
);

// check the existance of the temp dir
var tempFolder = path.resolve(
    path.join(__dirname, "../../.."), config["temp-folder"]
);

function makeSubsetTempFolder(hash, callback) {
    var subsetTempFolder = path.join(tempFolder, 'subset-' + hash);
    fs.exists(subsetTempFolder, function (exists) {
        if (!exists) {
            fs.mkdir(subsetTempFolder, function (err) {
                if (err) {
                    return callback(err);
                }

                return callback(null, subsetTempFolder);
            });
        }
        return callback(null, subsetTempFolder);
    });
}

function genSubsetFilesAndSaveToTempFolder(hash, chars, callback) {
    makeSubsetTempFolder(hash, function (err, subsetTempFolder) {
        if (err) {
            console.log(__filename + ": " + "Error when creating temp folder for subset fo font: " + hash);
            return callback(err);
        }

        console.log(__filename + ": " + "Created temp folder for subset fo font: " + hash + ", " + subsetTempFolder);
        SubsetterClient.getInstance(function (err, client) {
            if (err) {
                console.log(__filename + ": " + "Error when getting SubsetterClient.");
                return callback(err);
            }

            console.log(__filename + ": " + "Generated instance of SubsetterClient.");
            var fontPath = path.join(fontFolder, hash + ".fnt");
            var types = [FileType.TTF, FileType.EOT, FileType.WOFF];
            client.genSubset(fontPath, subsetTempFolder, chars, types, function (err) {
                if (err) {
                    console.log(__filename + ": " + "Error when calling 'client.genSubset'.");
                    return callback(err);
                }

                var files = [
                    path.join(subsetTempFolder, 'woff.woff'),
                    path.join(subsetTempFolder, 'eot.eot'),
                    path.join(subsetTempFolder, 'ttf.ttf')
                ];

                client.end();
                return callback(null, files);
            });
        });
    });
}

function readFileAsBase64(file, callback) {
    fs.readFile(file, function (err, data) {
        if (err) {
            return callback(err);
        }

        var base64Image = new Buffer(data, 'binary').toString('base64');
        return callback(null, base64Image);
    });
}

function genSubset(hash, chars, callback) {
    genSubsetFilesAndSaveToTempFolder(hash, chars, function (err, files) {
        if (err) {
            return callback(err);
        }

        async.map(files, readFileAsBase64, function (err, base64Images) {
            if (err) {
                return callback(err);
            }

            var result = {};
            for (var i in files) {
                var type = files[i].slice(files[i].indexOf('.') + 1);
                result[type] = base64Images[i];
            }

            return callback(null, result);
        });
    });
}

module.exports = {
    "genSubset": genSubset,
}

console.log(__filename + ": " + "Loaded module: " + __filename);
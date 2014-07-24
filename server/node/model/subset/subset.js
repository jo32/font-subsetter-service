var config = require("../../../config.json");
var path = require("path");
var fs = require("fs");
var SubsetterClient = require('../SubsetterClient');
var FileType = require('../../../thrift/gen-nodejs/subsetter_types').FileType;

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

function genSubsetAndSaveToTempFolder(hash, chars, callback) {
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

                return callback(null, files);
            });
        });
    });
}

module.exports = {
    "genSubsetAndSaveToTempFolder": genSubsetAndSaveToTempFolder,
}

console.log(__filename + ": " + "Loaded module: " + __filename);
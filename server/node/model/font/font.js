var config = require("../../../config.json");
var path = require("path");
var fs = require("fs");
var crypto = require('crypto');
var SubsetterClient = require('../SubsetterClient');
var db = require('../db/db');

// get the path of dir storing the font files
var fontFolder = path.resolve(
    path.join(__dirname, "../../.."), config["font-folder"]
);

// check the existance of the temp dir
var tempFolder = path.resolve(
    path.join(__dirname, "../../.."), config["temp-folder"]
);
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
}

function isExistFont(hash, callback) {
    var fontPath = path.join(fontFolder, hash + ".fnt");
    fs.exists(fontPath, callback);
}

function getFontListFromDb(callback) {
    db.getFontList(callback);
}

function deleteFontFromList(hash, callback) {
    getFontListFromDb(function (err, list) {
        if (err) {
            return callback(err);
        }

        for (var i in list) {
            var fontView = list[i];
            if (fontView.hash == hash) {
                list.pop(i);
            }
        }
    });
}

function getFontInfoFromDb(hash, callback) {
    db.getFont(hash, callback);
}

function saveFont(hash, callback) {

    var fontPath = path.join(fontFolder, hash + ".fnt");
    var tempFontPath = path.join(tempFolder, hash + ".fnt");

    var readStream = fs.createReadStream(tempFontPath);
    readStream.on("open", function () {

        var writeStream = fs.createWriteStream(fontPath);
        writeStream.on("open", function () {
            readStream.pipe(writeStream);

            readStream.on('end', function () {
                console.log(__filename + ": " + "copied file: " + tempFontPath + " to " + fontPath);

                getFontInfoFromFile(hash, function (err, info) {
                    if (err) {
                        return callback(err);
                    }

                    info.hash = hash

                    db.addFont(info, callback);
                });
            });
        });

        writeStream.on("error", callback);
    });

    readStream.on("error", callback);
}

function deleteFont(hash, callback) {

    var fontPath = path.join(fontFolder, hash + ".fnt");
    db.removeFont(hash, function (err) {
        if (err) {
            return callback(err);
        }
        console.log(__filename + ": " + "deleted font from DB: " + hash);

        fs.unlink(fontPath, function (err) {
            console.log(__filename + ": " + "deleted file: " + fontPath);
            return callback(err);
        });
    });
}

function getFontInfoFromFile(hash, callback) {

    SubsetterClient.getInstance(function (err, client) {
        if (err) {
            return callback(err);
        }

        var fontPath = path.join(fontFolder, hash + ".fnt");
        client.getFontInfo(fontPath, function (err, info) {
            if (err) {
                return callback(err);
            }

            client.end();
            return callback(null, info);
        });
    });
}

function getFontHashValidator(hash) {

    var shasum = crypto.createHash('sha1');

    function update(data) {
        shasum.update(data);
    }

    function tell() {

        var realDigest = shasum.digest('hex');
        console.log(__filename + ": " + "FontHashValidator: " + realDigest + " vs " + hash + ", " + (realDigest == hash));
        if (realDigest != hash) {
            return false;
        } else {
            return true;
        }
    }

    return {
        "update": update,
        "tell": tell
    }
}

function getTempFontWriter(hash, callback) {

    if (!/\d{1,64}/.test(hash)) {
        var err = new Error("The hash is not in right format.");
        err.status = 406;
        return callback(err, null);
    }

    var tempFontPath = path.join(tempFolder, hash + ".fnt");

    fs.open(tempFontPath, "w", function (err, fd) {

        console.log(__filename + ": " + "Opened file: " + tempFontPath);
        if (err) {
            err.status = 500;
            return callback(err, null);
        }

        function write(data, callback) {
            fs.write(fd, data, 0, data.length, null, function (err, written, buffer) {
                callback(err);
            });
        }

        function end(callback) {
            fs.close(fd, function (err) {
                if (err) {
                    console.log(__filename + ": " + "Error when closing file: " + tempFontPath);
                    return callback(err, null);
                }

                console.log(__filename + ": " + "Closed file: " + tempFontPath);
                return callback(null, tempFontPath)
            });
        }

        return callback(null, {
            "write": write,
            "end": end
        });

    });
}

module.exports = {

    "getFontHashValidator": getFontHashValidator,
    "getTempFontWriter": getTempFontWriter,
    "saveFont": saveFont,
    "deleteFont": deleteFont,
    "getFontInfoFromDb": getFontInfoFromDb,
    "getFontListFromDb": getFontListFromDb,
    "getFontInfoFromFile": getFontInfoFromFile,
}

console.log(__filename + ": " + "Loaded module: " + __filename);
var express = require('express');
var router = express.Router();
var busboy = require('connect-busboy');
var fontModel = require('../model/font/font');

router.get('/', function (req, res, next) {
    // Get all fonts as a list

    fontModel.getFontListFromDb(function (err, list) {
        if (err) {
            return next(err);
        }

        console.log(__filename + ": " + "Fetched fontlist from DB");
        res.json(list);
    });
});

router.get('/:hash', function (req, res, next) {
    // Get the detail of a font according to its id

    var hash = req.params.hash;
    fontModel.getFontInfoFromDb(hash, function (err, info) {
        if (err) {
            return next(err);
        }

        console.log(__filename + ": " + "Fetched info of font with hash " + hash + " from DB");
        res.json(info);
    });
});

// super kengdie
router.use('/', busboy());
router.post('/:hash', function (req, res, next) {

    // Adding a font
    // Needed parameters:
    // 1. hash: of the current font

    var hash = req.params.hash;
    console.log(__filename + ": " + "Got expecting hash: " + hash);
    var validator = fontModel.getFontHashValidator(hash);
    var tempFontWriter = fontModel.getTempFontWriter(hash, function (err, writer) {

        if (!req.headers['content-type'].indexOf('multipart/form-data') < 0) {
            var err = Error("The format maybe of encoeded as 'multipart/form-data', found content type: " + req.headers['content-type']);
            err.status = 406;
            return next(err);
        }

        if (!req.busboy) {
            var err = Error("File not found in request");
            err.status = 406;
            return next(err);
        }

        console.log(__filename + ": " + "Created tempFontWriter for hash: " + hash);

        req.pipe(req.busboy);
        var isReturned = false;

        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            console.log(__filename + ": " + "Processing upload file with filename: " + filename + ", " + mimetype);
            file.on('data', function (data) {
                if (isReturned) {
                    return;
                }

                validator.update(data);
                writer.write(data, function (err) {

                    if (err) {
                        console.log(__filename + ": " + "Error when writing buffer of file: " + filename);
                        err.status = 500;
                        isReturned = true;
                        return next(err);
                    }
                });
            });

            file.on('end', function () {
                if (isReturned) {
                    return;
                }

                writer.end(function (err, tempFontPath) {

                    if (err) {
                        isReturned = true;
                        return next(err);
                    }

                    var isValid = validator.tell();
                    if (!isValid) {
                        console.log(__filename + ": " + "Hash mismatch error of: " + filename);
                        var err = new Error("hash mismatch");
                        err.status = 406;
                        isReturned = true;
                        return next(err);
                    }

                    fontModel.saveFont(hash, function (err) {
                        if (err) {
                            isReturned = true;
                            return next(err);
                        }

                        console.log(__filename + ": " + "successfully Processed font with hash" + hash);
                        res.json({
                            "status": 200,
                            "message": "upload successfully"
                        });
                    });
                });
            });
        });

        req.busboy.on('finish', function () {

            if (isReturned) {
                return;
            }

            console.log(__filename + ": " + "busboy finished.")
        });
    });


});

module.exports = router;
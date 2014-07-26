var levelup = require('levelup');
var path = require('path');
var config = require("../../../config.json");

// get the path of leveldb database
var dbFolder = path.resolve(
    path.join(__dirname, "../../.."), config["db-folder"]
);
var db = levelup(dbFolder);

var FONT_SET_KEY = "font-set";

function get(key, callback) {
    db.get(key, function (err, value) {

        if (err) {
            return callback(err);
        }

        value = JSON.parse(value);
        return callback(null, value);
    });
}

function put(key, value, callback) {
    value = JSON.stringify(value);
    db.put(key, value, callback);
}

function del(key, callback) {
    db.del(key, callback);
}

function getFontSet(callback) {
    get(FONT_SET_KEY, callback);
}

function getFontList(callback) {
    getFontSet(function (err, set) {
        if (err) {
            return callback(err);
        }

        var list = [];
        for (var i in set) {
            list.push(set[i]);
            list.sort(function (a, b) {
                return a.name < b.name ? -1 : (a.name == b.name ? 0 : 1);
            });
        }

        return callback(null, list);
    });
}

function addFontToSet(font, callback) {

    var fontView = {};
    fontView.hash = font.hash;
    fontView.name = font.FullFontName;

    getFontSet(function (err, set) {
        if (err) {
            if (err.type == 'NotFoundError') {
                set = {};
            } else {
                return callback(err);
            }
        }

        set[fontView.hash] = fontView;
        put(FONT_SET_KEY, set, callback);
    });
}

function removeFontFromSet(hash, callback) {
    getFontSet(function (err, set) {
        if (err) {
            return callback(err);
        }

        delete set[hash];
        put(FONT_SET_KEY, set, callback);
    });
}

function addFont(font, callback) {

    put("font-" + font.hash, font, function (err) {
        if (err) {
            return callback(err);
        }

        addFontToSet(font, callback);
    });
}

function getFont(hash, callback) {

    get("font-" + hash, callback);
}

function removeFont(hash, callback) {

    del("font-" + hash, function (err) {
        if (err) {
            return callback(err);
        }

        removeFontFromSet(hash, callback);
    });

}

function getDb() {
    return db;
}

module.exports = {

    "addFont": addFont,
    "getFont": getFont,
    "removeFont": removeFont,
    "getFontList": getFontList,
    "getDb": getDb
}

console.log(__filename + ": " + "Loaded module: " + __filename);
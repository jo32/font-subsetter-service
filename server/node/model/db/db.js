var levelup = require('levelup');
var path = require('path');
var config = require("../../../config.json");

// get the path of leveldb database
var dbFolder = path.resolve(
    path.join(__dirname, "../../.."), config["db-folder"]
);
var db = levelup(dbFolder);

var FONT_LIST_KEY = "font-list";

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

function getFontList(callback) {
    get(FONT_LIST_KEY, callback);
}

function addFontToList(font, callback) {
    var fontView = {};
    fontView.hash = font.hash;
    fontView.name = font.FullFontName;

    getFontList(function (err, list) {
        if (err) {
            if (err.type == 'NotFoundError') {
                list = [];
            } else {
                return callback(err);
            }
        }

        list.push(fontView);
        put(FONT_LIST_KEY, list, callback);
    });
}

function addFont(font, callback) {
    put("font-" + font.hash, font, function (err) {
        if (err) {
            return callback(err);
        }

        addFontToList(font, callback);
    });
}

function getFont(hash, callback) {

    get("font-" + hash, callback);
}

function getDb() {
    return db;
}

module.exports = {

    "addFont": addFont,
    "getFont": getFont,
    "getFontList": getFontList,
    "getDb": getDb
}

console.log(__filename + ": " + "Loaded module: " + __filename);
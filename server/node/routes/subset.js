var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    // Get the subset given the subset chars
    // Needed query parameters:
    // 1. chars: the subset chars of font
    res.json({});
});

module.exports = router;
var express = require('express');
var router = express.Router();

router.get('/:hash', function (req, res) {
    // Get the subset given the subset chars
    // Needed query parameters:
    // 1. chars: the subset chars of font
    var hash = req.params.hash;
    var chars = req.query.chars;

    

    res.json({});
});

module.exports = router;
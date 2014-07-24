var express = require('express');
var router = express.Router();
var subsetModel = require('../model/subset/subset');

var RouterExtension = require('../model/lib/RouterExtension');
RouterExtension.extendRouterParam(router);

router.param('hash', /\w+/);
router.get('/:hash', function (req, res, next) {

    // Get the subset given the subset chars
    // Needed query parameters:
    // 1. chars: the subset chars of font

    var hash = req.params.hash[0];
    var chars = req.query.chars;

    if (!chars || !/\S+/.test(chars)) {
        var err = new Error("Query parameter 'chars' is not found or not in the right format.");
        err.status = 406;
        return next(err);
    }

    subsetModel.genSubset(hash, chars, function (err, result) {
        if (err) {
            return next(err);
        }

        res.json(result);
    });
});

module.exports = router;
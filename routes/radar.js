var express = require('express');
var router = express.Router();
var attackService = require('../services/attack');

router.post("/", async (req, res) => {
    var params = req.body;

    try {
        var response = attackService.calcAttack(params);
        return res.status(200).jsonp(response);
    } catch (err) {
        return res.status(400).jsonp({ error: err });
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid')
let myAuth = require("../auth/auth")

router.get('/', myAuth, function (req, res, next) {
    res.redirect(`/user/${uuidv4()}`)
});

router.get('/:room', myAuth, function (req, res, next) {
    res.render('room', { roomID: req.params.room });
});

module.exports = router;
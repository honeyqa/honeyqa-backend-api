var express = require('express'),
    User = db.model('User'),
    router = express.Router();

router.post('/', function (req, res) {
    if (!req.body.email || !req.body.password) res.json({ code : 101, message : "failed" });

    User.findOne({ "email" : req.body.email }, function (err, user) {
        if (user) res.json({ code : 102, message : "account duplicated" });

        new User({
            email: req.body.email,
            password: req.body.password
        }).save(function (err) {
            if (err) res.json({ code : 100, message: "unknown error" });
            res.json({ code: 200 , message : "success" });
        });
    });
});

router.post('/login', function (req, res) {
    if (!req.body.email || !req.body.password) res.json({ code : 101, message : "failed" });

    User.findOne({ "email" : req.body.email, "password" : req.body.password }, function (err, user) {
        if (!user) res.json({ code : 102, message : "no account" });
        res.json(user);
    });
});

module.exports = router;

var express = require('express'),
    Project = db.model('Project'),
    crypto = require('crypto'),
    router = express.Router();

router.post('/:project_id', function (req, res) {
    if (!req.params.project_id) res.json({ code : 101, message: "failed" });
    Project.findById(req.params.project_id, function (err, projects) {
        projects.error.push({
            errorMessage: req.body.errormessage,
            className: req.body.classname,
            methodName: req.body.methodname,
            fileName: req.body.filename,
            errorLine: req.body.errorline,
            errorStack: req.body.errorstack,
            osVersion: req.body.osversion,
            osArch: req.body.osarch,
            appMemTotal: req.body.memtotal,
            appMemFree: req.body.memfree,
	    createdAt: new Date()
        });
        projects.save(function (err) {
            if (err) res.json({ code: 100, message: "unknown error" });
            res.json({ code: 200, message: "success" });
        });
    });
});

router.get('/project_id', function (req, res) {
    if (!req.params.project_id) res.json({ code : 101, message : "failed" });
    Project.findById(req.params.project_id, function (err, projects) {
        if (err) res.json({ code : 100, message : "unknown error"  });
        res.json({ code : 200, errors : projects.error });
    });

});

module.exports = router;

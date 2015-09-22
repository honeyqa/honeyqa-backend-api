var express = require('express'),
    Project = db.model('Project'),
    crypto = require('crypto'),
    router = express.Router();

router.post('/', function(req, res) {
    if (!req.get('user_id')) res.json({ code : 101, message : "failed" });
    else {
      new Project({
        userId: req.get('user_id'),
        name: req.body.name,
        appVersion: req.body.appversion,
        apiKey: crypto.randomBytes(10).toString('hex')
      }).save(function (err) {
          if (err) res.json({ code : 100, message : "unknown error" });
          res.json({ code : 200, message : "success" });
      });
    }
});

router.get('/:user_id', function (req, res) {
    Project.find({ "userId" : req.params.user_id }, function (err, projects) {
      
        console.log(projects.length);

        var projectIds = [];

        projects.forEach(function (projects) {
            projectIds.push(projects.id);
        }); 
        
        res.json({ code: 200, projects: projects });
    })
});

router.get('/project_id', function (req, res) {
    Project.findById(req.params.project_id, function (err, projects) {
        res.json({ code: 200, projects: projects });
    })
});

module.exports = router;

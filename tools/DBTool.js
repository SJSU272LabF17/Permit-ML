
var PermitApplication = require('../models/PermitApplication');


exports.getAllPermitApplication = function(callback) {
    PermitApplication.find({}).exec(function(err, applications){
        if (err){
            callback(err, null);
        } else{
            var res = [];
            for (var i = 0; i < applications.length; i++){

                var application = applications[i];
                res.push(application);
            }
            callback(null, res);
        }
    });
};
// var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user');

exports.init = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, callback) {
        User.findOne({username: username, password: password}).exec(function(err, user){
            if (user) { //success
                callback(null, {status_code: "200", username: username, value: "Success Login"});
            } else{
                callback(null, {status_code: "400", value: "Wrong password"});
            }
        });
    }));

    passport.use('signup', new LocalStrategy(function(username, password, done) {
        console.log("passport('signup'), username = "+ username+", password = "+ password);

        User.findOne({username: username}).exec(function(err, user){
            if (user) { //user has alread been existed
                callback(null, {status_code: "400", value: "username has been existed"});
            } else{
                var userInstance = new User({ username: username, password: password });        
                userInstance.save(function (err) {
                    if (err) {
                      console.log(err);
                      callback(null, {status_code: "500", value: "backend error when signup"});
                    } else{
                      callback(null, {status_code: "200", username: username, value: "Successfully signup"});
                    }
                });
            }
        });         
    }));
};



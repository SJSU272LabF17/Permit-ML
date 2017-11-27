// var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/User');

exports.init = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, callback) {
        console.log(username);
        console.log(password);
        User.findOne({email: username, password: password}).exec(function(err, user){
            if (user) { //success
                callback(null, {status_code: "200", user: user, value: "Success Login"});
            } else{
                callback(null, {status_code: "400", value: "Wrong password"});
            }
        });
    }));
};



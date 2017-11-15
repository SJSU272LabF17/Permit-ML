var express = require('express');
var path = require('path');
global.appRootDir = path.resolve(__dirname);

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport').init(passport);
//var parser = require('multer')();
var multer =require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var FileTool = require('./tools/FileTool');

var AWS = require('aws-sdk');
var machinelearning = new AWS.MachineLearning({
    endpoint: 'machinelearning.us-east-1.amazonaws.com', // (String) — The endpoint URI to send requests to. The default endpoint is built from the configured region. The endpoint should be a string like 'https://{service}.{region}.amazonaws.com'.
    accessKeyId: '',  // (String) — your AWS access key ID.
    secretAccessKey: '' // (String) — your AWS secret access key.
});
// console.log(machinelearning);


// - Get Model information
// var params = {
//   MLModelId: 'STRING_VALUE', /* required */
//   Verbose: true
// };
// machinelearning.getMLModel(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


// - Predict
// var params = {
//   MLModelId: 'STRING_VALUE', /* required */
//   PredictEndpoint: 'STRING_VALUE', /* required */
//   Record: { /* required */
//     '<VariableName>': 'STRING_VALUE',
//     /* '<VariableName>': ... */
//   }
// };
// machinelearning.predict(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());

//var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage });

app.use('/', routes);
app.use('/users', users);
app.get('/signuphere',function (req,res) {
    res.render("signup.ejs")

});


app.get('/form',function (req,res,next) {


        res.render('form.ejs')
        });




/* GET home page. */
app.get('/dashboard', function(req, res, next) {
    var json = {
        username: 'hanbing',
        alertList: [
            {
                alert_id: 'A123'
            },{
                alert_id: 'A124'
            }
        ]
    }
  res.render('dashboard/dashboard', {
    title: 'Express',
    data: json 
  });
});


app.post('/formsubmission',function (req,res) {
    console.log(req.body);
    
});




app.get('/loginhere',function(req,res,next){

   res.render('login.ejs');

});



app.post('/redirectHome',function (req, res) {
    // console.log("post /redirectHome, req.session.username = "+req.session.user);
    //Checks before redirecting whether the session is valid
    if(req.session.user) {
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        // res.render("homepage",{username:req.session.username});
        res.status(200).send({"status_code": 200, "username": req.session.user});
    } else {
        res.status(400).send({"status_code": 400});
        // res.redirect('http://localhost:3000/login');
    }
});

app.post('/logout', function(req,res) {
    // console.log(req.session.user);
    req.session.destroy();
    // console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/afterSignin', function(req, res) {
    // console.log("post /login");
    console.log(req.body);
    passport.authenticate('login', function(err, results) {
        // console.log("passport.authenticate(), results = "+ JSON.stringify(results));
        if(err) {
            return res.status(500).send({"status_code": 500, "message": "server error when login"});
        }

        if (results.status_code == 200){
            req.session.user = results.username;
            req.session.current_path = '/';
            // console.log("req.session.user = "+req.session.user);
            // console.log("session initilized, return status 200");
            return res.status(200).send(results);
        } else{
            return res.status(400).send(results);
        }
    })(req, res);
});

app.post('/afterSignup',function (req, res) {
    console.log(req.body);
    passport.authenticate('signup', function(err, results) {
        // console.log("passport.authenticate('signup'), results = "+JSON.stringify(results));
        if(err) {
            return res.status(500).send({"statusCode": 500, "message": "server error when signup"});
        }
        return res.status(results.status_code).send(results);
    })(req, res);
});

app.post('/files', upload.any(), function(req, res) {
    console.log("====>app.post(/files)");
    // console.dir(req.files);

    var file = req.files[0];
    // console.log("for each file:");

    var username = req.body.username;
    var path = req.body.path;
    var from = __dirname+'/'+file.path;
    var to = FileTool.getUserPath(username)+path;

    // console.log("move file from: "+from);
    console.log("created file in: "+to);

    if (!fs.existsSync(to)){
        // console.log("to folder not exist, create folder");
        mkdirp.sync(to);
    }
    fs.rename(from, to+file.originalname);

    // console.log("end uploading files");

    var json = {
        status_code: 200,
        files: FileTool.getFiles(username, path),
        message: 'successfully uploaded'
    }

    console.log(json);

    res.status(200).send(json);
});

var port = process.env.PORT || 8000;
var server = app.listen(port, function(){
    console.log('App listening on port %s', port);
});

function stop() {
    server.close();
}

module.exports = app;
module.exports.stop = stop;
